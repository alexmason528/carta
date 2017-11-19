import { validatorFactory } from 'utils/reduxForm'

const schema = {
  email: {
    presence: true,
    email: {
      message: '^Please enter a valid email address',
    },
  },
  password: {
    presence: {
      message: '^Please enter a password',
    },
    length: {
      minimum: 3,
      message: '^Your password must be 3 characters or longer',
    },
  },
  confirmPassword: {
    equality: {
      attribute: 'password',
      message: '^These passwords are not identical',
    },
  },
  fullname: {
    presence: {
      message: '^Please enter your name',
    },
  },
}

export default validatorFactory(schema)
