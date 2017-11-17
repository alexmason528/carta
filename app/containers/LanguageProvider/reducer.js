import {
  CHANGE_LOCALE,
} from './constants'

import {
  DEFAULT_LOCALE,
} from '../App/constants'

const initialState = {
  locale: DEFAULT_LOCALE,
}

function languageProviderReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CHANGE_LOCALE:
      return { locale: payload }
    default:
      return state
  }
}

export default languageProviderReducer
