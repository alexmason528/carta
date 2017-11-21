import { validatorFactory } from 'utils/reduxForm'

const schema = {
  password: {
    presence: {
      message: '^carta.requirePassword',
    },
  },
}

export default validatorFactory(schema)
