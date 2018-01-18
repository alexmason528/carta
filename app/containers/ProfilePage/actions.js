import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
} from './constants'

export function getProfileRequest() {
  return {
    type: GET_PROFILE_REQUEST,
  }
}

export function getProfileSuccess(payload) {
  return {
    type: GET_PROFILE_SUCCESS,
    payload,
  }
}

export function getProfileFail() {
  return {
    type: GET_PROFILE_FAIL,
    payload,
  }
}
