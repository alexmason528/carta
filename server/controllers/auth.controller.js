const User = require('../models/user')
const nodemailer = require('nodemailer')
const Cryptr = require('cryptr')
const cryptr = new Cryptr('carta')
const ses = require('nodemailer-ses-transport')

let transporter = nodemailer.createTransport(ses({
  accessKeyId: 'AKIAILWMKMTWHAJBH5HQ',
  secretAccessKey: '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',
  region: 'eu-west-1',
}))

/**
 * Login
 * @param req
 * @param res
 * @returns userInfo
 */
const login = (req, res) => {
  const { email, password } = req.body

  User.find({ email: email }, (err, element) => {
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
      const verifyUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/home/verify' : 'https://cartamap.herokuapp.com/home/verify'
      let mailOptions = {
        from: '<no-reply@carta.guide>',
        to: data.email,
        subject: 'Verification required',
        text: `Hi, ${data.firstname} ${data.lastname}`,
        html: `Please verify your email by clicking <a href="${verifyUrl}/${cryptr.encrypt(data.email)}">this link</a>`,
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
 * delete
 * @param req
 * @param res
 * @returns success or fail
 */

const deleteUser = (req, res) => {
  const { userID } = req.params

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

module.exports.login = login
module.exports.register = register
module.exports.verify = verify
module.exports.deleteUser = deleteUser

