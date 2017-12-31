const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const Cryptr = require('cryptr')
const cryptr = new Cryptr('carta', 'aes256')
const ses = require('nodemailer-ses-transport')
const Post = require('../models/post')
const User = require('../models/user')

let transporter = nodemailer.createTransport(
  ses({
    accessKeyId: 'AKIAILWMKMTWHAJBH5HQ',
    secretAccessKey: '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',
    region: 'eu-west-1',
  })
)

/**
 * SignIn
 * @param req
 * @param res
 * @returns userInfo
 */
const signIn = (req, res) => {
  const { email, password } = req.body

  User.find({ email: email }, (err, element) => {
    if (element.length > 0) {
      if (element[0].password === cryptr.encrypt(password)) {
        const { _id, fullname, email, role, profilePic, verified } = element[0]
        const data = {
          _id,
          fullname,
          email,
          role,
          profilePic,
          verified,
        }
        return res.json(data)
      } else {
        return res.status(400).send({
          error: {
            details: 'carta.incorrectPassword',
          },
        })
      }
    } else {
      return res.status(400).send({
        error: { details: 'carta.incorrectEmail' },
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
  const {
    fullname,
    email,
    role,
    profilePic,
    password,
    confirmPassword,
  } = req.body

  if (password !== confirmPassword) {
    return res.status(400).send({
      error: {
        details: 'carta.passwordNotEqual',
      },
    })
  }

  let data = {
    fullname,
    email,
    password: cryptr.encrypt(password),
    role,
    profilePic,
    verified: false,
  }

  User.create(data, err => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(400).send({
          error: {
            details: 'carta.alreadyRegistered',
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
      const verifyUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/verify'
          : 'https://cartamap.herokuapp.com/verify'
      let mailOptions = {
        from: '<Carta@carta.guide>',
        to: data.email,
        subject: 'Verify your email',
        text: `Hi, ${data.fullname}`,
        html: `Please verify your email by clicking <a href="${verifyUrl}/${cryptr.encrypt(
          data.email
        )}">this link</a>`,
      }

      transporter.sendMail(mailOptions, () => {
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

  User.findOneAndUpdate(
    { _id: userID },
    { $set: req.body },
    { new: true },
    (err, element) => {
      if (element && element.fullname) {
        let response = {
          _id: element._id,
          fullname: element.fullname,
          email: element.email,
          role: element.role,
          profilePic: element.profilePic,
          verified: element.verified,
        }
        return res.json(response)
      }

      return res.status(400).send({
        error: {
          details: 'Failed to update',
        },
      })
    }
  )
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

  User.findOneAndUpdate(
    { email: email },
    { $set: { verified: true } },
    { new: true },
    (err, element) => {
      if (element && element.fullname) {
        let response = {
          _id: element._id,
          fullname: element.fullname,
          email: element.email,
          role: element.role,
          profilePic: element.profilePic,
          verified: true,
        }
        return res.json(response)
      }

      return res.status(400).send({
        error: {
          details: 'Failed to verify',
        },
      })
    }
  )
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

  User.findOne(
    { _id: userID, password: cryptr.encrypt(password) },
    (err, element) => {
      if (err) {
        return res.status(400).send({
          error: {
            details: err.toString(),
          },
        })
      }

      if (!element) {
        return res.status(400).send({
          error: {
            details: 'Password is not correct',
          },
        })
      }

      User.remove({ _id: userID }, err => {
        if (err) {
          return res.status(400).send({
            error: {
              details: err.toString(),
            },
          })
        } else {
          Post.remove({ author: mongoose.Types.ObjectId(userID) }, err => {
            if (err) {
              return res.status(400).send({
                error: {
                  details: err.toString(),
                },
              })
            } else {
              return res.json({})
            }
          })
        }
      })
    }
  )
}

module.exports.signIn = signIn
module.exports.register = register
module.exports.verify = verify
module.exports.updateUser = updateUser
module.exports.deleteUser = deleteUser
