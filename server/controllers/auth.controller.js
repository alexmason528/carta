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
        const { _id, fullname, email, role, profile_pic, cover_img, verified } = element[0]
        const data = { _id, fullname, email, role, profile_pic, cover_img, verified }
        return res.json(data)
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
          details: 'Invalid email',
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
  const { fullname, email, role, profile_pic, cover_img, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.status(400).send({
      error: {
        details: 'Confirm password is not correct',
      },
    })
  }

  let data = {
    fullname,
    email,
    password,
    role,
    profile_pic,
    cover_img,
    verified: false,
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
            details: err.toString(),
          },
        })
      }
    } else {
      const verifyUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/home/verify' : 'https://cartamap.herokuapp.com/home/verify'
      let mailOptions = {
        from: '<no-reply@carta.guide>',
        to: data.email,
        subject: 'Verification required',
        text: `Hi, ${data.fullname}`,
        html: `Please verify your email by clicking <a href="${verifyUrl}/${cryptr.encrypt(data.email)}">this link</a>`,
      }

      transporter.sendMail(mailOptions, (error, info) => {
        return res.send(data)
      })
    }
  })
}

/**
 * update
 * @param req
 * @param res
 * @returns success or fail
 */

const updateUser = (req, res) => {
  const { userID } = req.params

  User.findOneAndUpdate({ _id: userID }, { $set: req.body }, { new: true }, (err, element) => {
    if (element && element.fullname) {
      let response = {
        _id: element._id,
        fullname: element.fullname,
        email: element.email,
        role: element.role,
        profile_pic: element.profile_pic,
        cover_img: element.cover_img,
        verified: element.verified,
      }
      return res.json(response)
    }

    return res.status(400).send({
      error: {
        details: 'Failed to update',
      },
    })
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
    if (element && element.fullname) {
      let response = {
        _id: element._id,
        fullname: element.fullname,
        email: element.email,
        role: element.role,
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
  const { password } = req.body

  // User.remove({ _id: userID, password: password }, (err) => {
  //   if (err) {
  //     return res.status(400).send({
  //       error: {
  //         details: err.toString(),
  //       },
  //     })
  //   } else {
  //     return res.json({})
  //   }
  // })

  User.findOne({ _id: userID, password: password }, (err, element) => {
    if (err) {
      return res.status(400).send({
        error: {
          details: err.toString(),
        },
      })
    }
  })
}

module.exports.login = login
module.exports.register = register
module.exports.verify = verify
module.exports.updateUser = updateUser
module.exports.deleteUser = deleteUser
