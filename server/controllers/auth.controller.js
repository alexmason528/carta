const User = require('../models/user')
const nodemailer = require('nodemailer')
const Cryptr = require('cryptr')
const cryptr = new Cryptr('carta')

let transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'wtun2bibtcxsrwmt@ethereal.email',
    pass: 'DBK8x19yknPh2YawST',
  },
})

const verify = (req, res) => {
  const { vcode } = req.body

  let email
  try {
    email = cryptr.decrypt(vcode)
  } catch (e) {
    return res.status(400).send({
      error: {
        details: 'Failed to verify',
      },
    })
  }

  User.findOneAndUpdate({ email: email }, { $set: { verified: true } }, { new: true }, (err, element) => {
    if (element && element.firstname) {
      let response = {
        firstname: element.firstname,
        lastname: element.lastname,
        email: element.email,
        profile_pic: element.profile_pic,
        cover_img: element.cover_img,
        verified: true,
      }
      return res.json(response)  
    } 

    return res.status(400).send({
      error: {
        details: 'Failed to verify',
      },
    })
  })
}
/**
 * Login
 * @param req
 * @param res
 * @returns userInfo
 */
const login = (req, res) => {
  const { email, password } = req.body

  User.find({ email: email }, { _id: 0 }, (err, element) => {
    if (element.length > 0) {
      if (element[0].password === password) {
        return res.json(element[0])
      } else {
        return res.status(400).send({
          error: {
            details: 'Wrong password',
          },
        })
      }
    } else {
      return res.status(400).send({
        error: {
          details: 'Invalid username',
        },
      })
    }
  })
}


/**
 * Register
 * @param req
 * @param res
 * @returns userInfo
 */
const register = (req, res) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.status(400).send({
      error: {
        details: 'Confirm password is not correct',
      },
    })
  }

  let data = {
    firstname,
    lastname,
    email,
    password,
    profile_pic: '',
    cover_img: '',
    verified: false,
  }

  for (let file of req.files) {
    data[file.fieldname] = (process.env.NODE_ENV === 'development') ?
    `http://localhost:3000/public/uploads/user/${file.filename}` : `https://cartamap.herokuapp.com/public/uploads/user/${file.filename}`
  }

  User.create(data, (err, element) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(400).send({
          error: {
            details: 'Email is already taken by other user',
          },
        })
      } else {
        return res.status(400).send({
          error: {
            details: err,
          },
        })
      }
    } else {
      let mailOptions = {
        from: '<no-reply@carta.guide>',
        to: data.email,
        subject: 'Verification required',
        text: `Hi, ${data.firstname} ${data.lastname}`,
        html: `Please verify your email by clicking <a href="http://localhost:3000/verify/${cryptr.encrypt(data.email)}">this link</a>`,
      }

      transporter.sendMail(mailOptions, (error, info) => {
        return res.send(data)
      })
    }
  })
}

/**
 * verify
 * @param req
 * @param res
 * @returns success or fail
 */

module.exports.login = login
module.exports.register = register
module.exports.verify = verify
