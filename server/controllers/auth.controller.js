const User = require('../models/user');

/**
 * Login
 * @param req
 * @param res
 * @returns userInfo
 */
const login = (req, res) => {
  const params = req.body;
  const { email, password } = params;

  User.find({ email: email }, { _id: 0 }, (err, element) => {
    if (element.length > 0) {
      if (element[0].password === password) {
        res.json(element[0]);
      } else {
        res.status(400).send({
          error: {
            details: 'Invalid password',
          },
        });
      }
    } else {
      res.status(400).send({
        error: {
          details: 'Invalid password',
        },
      });
    }
  });
};


/**
 * Register
 * @param req
 * @param res
 * @returns userInfo
 */
const register = (req, res) => {
  const params = req.body;
  res.json(params);
};

module.exports.login = login;
module.exports.register = register;
