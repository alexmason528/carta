import {
  GET_THEMES_REQUEST,
  GET_THEMES_SUCCESS,
  GET_THEMES_FAIL,
} from './constants'

export function getThemesRequest() {
  return {
    type: GET_THEMES_REQUEST,
  }
}

export function getThemesSuccess(payload) {
  return {
    type: GET_THEMES_SUCCESS,
    payload,
  }
}

export function getThemesFail() {
  return {
    type: GET_THEMES_FAIL,
    payload,
  }
}
