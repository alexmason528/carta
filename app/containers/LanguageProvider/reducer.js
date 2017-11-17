import { getItem, setItem } from 'utils/localStorage'
import { DEFAULT_LOCALE } from 'containers/App/constants'
import { CHANGE_LOCALE } from './constants'

const initialState = {
  locale: getItem('locale') || DEFAULT_LOCALE,
}

function languageProviderReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CHANGE_LOCALE:
      setItem('locale', payload)
      return { locale: payload }
    default:
      return state
  }
}

export default languageProviderReducer
