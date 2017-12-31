import { getItem, setItem } from 'utils/localStorage'
import { DEFAULT_LOCALE, CHANGE_LOCALE } from './constants'

const browserLanguage = window.navigator.language

let locale = browserLanguage === 'nl' ? 'nl' : DEFAULT_LOCALE

const initialState = {
  locale: getItem('locale') || locale,
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
