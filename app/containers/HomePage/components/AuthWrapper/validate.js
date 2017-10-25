import { validatorFactory } from 'utils/reduxForm'

const schema = {
  email: { presence: true, email: true },
  password: {
    presence: true,
    length: {
      minimum: 3,
    },
  },
  confirmPassword: {
    equality: 'password',
  },
  fullname: { presence: true },
}

export default validatorFactory(schema)