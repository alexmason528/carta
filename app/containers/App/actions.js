import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,

  LOGOUT,

  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,

  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  VERIFY_FAIL,

  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,

  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
} from './constants'

export function loginRequest(payload) {
  return {
    type: LOGIN_REQUEST,
    payload,
  }
}

export function loginSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload,
  }
}

export function loginFail(payload) {
  return {
    type: LOGIN_FAIL,
    payload,
  }
}

export function logOut() {
  return {
    type: LOGOUT,
  }
}

export function registerRequest(payload) {
  return {
    type: REGISTER_REQUEST,
    payload,
  }
}

export function registerSuccess(payload) {
  return {
    type: REGISTER_SUCCESS,
    payload,
  }
}

export function registerFail(payload) {
  return {
    type: REGISTER_FAIL,
    payload,
  }
}

export function verifyRequest(payload) {
  return {
    type: VERIFY_REQUEST,
    payload,
  }
}

export function verifySuccess(payload) {
  return {
    type: VERIFY_SUCCESS,
    payload,
  }
}

export function verifyFail(payload) {
  return {
    type: VERIFY_FAIL,
    payload,
  }
}

export function deleteUserRequest(payload) {
  return {
    type: DELETE_USER_REQUEST,
    payload,
  }
}

export function deleteUserSuccess() {
  return {
    type: DELETE_USER_REQUEST,
  }
}

export function deleteUserFail(payload) {
  return {
    type: DELETE_USER_REQUEST,
    payload,
  }
}

export function updateUserRequest(payload) {
  return {
    type: UPDATE_USER_REQUEST,
    payload,
  }
}

export function updateUserSuccess(payload) {
  return {
    type: UPDATE_USER_SUCCESS,
    payload,
  }
}

export function updateUserFail(payload) {
  return {
    type: UPDATE_USER_FAIL,
    payload,
  }
}
