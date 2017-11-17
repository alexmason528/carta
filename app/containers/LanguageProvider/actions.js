import {
  CHANGE_LOCALE,
} from './constants'

export function changeLocale(payload) {
  return {
    type: CHANGE_LOCALE,
    payload,
  }
}
