const User = require('../models/user')
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
        res.json(element[0])
      } else {
        res.status(400).send({
          error: {
            details: 'Wrong password',
          },
        })
      }
    } else {
      res.status(400).send({
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
    res.status(400).send({
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
        res.status(400).send({
          error: {
            details: err,
          },
        })
      }
    } else {
      res.send(data)
    }
  })
}

module.exports.login = login
module.exports.register = register
