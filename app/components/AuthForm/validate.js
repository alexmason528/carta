import { validatorFactory } from 'utils/reduxForm'

const schema = {
  email: {
    presence: {
      message: '^carta.requireEmail',
    },
    email: {
      message: '^carta.validEmail',
    },
  },
  password: {
    presence: {
      message: '^carta.requirePassword',
    },
    length: {
      minimum: 6,
      message: '^carta.passwordLength',
    },
  },
  confirmPassword: {
    equality: {
      attribute: 'password',
      message: '^carta.passwordNotEqual',
    },
  },
  fullname: {
    presence: {
      message: '^carta.requireName',
    },
  },
}

export default validatorFactory(schema)
