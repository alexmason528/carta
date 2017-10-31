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

  UPDATE_COVER_IMG_REQUEST,
  UPDATE_COVER_IMG_SUCCESS,
  UPDATE_COVER_IMG_FAIL,

  UPDATE_PROFILE_PIC_REQUEST,
  UPDATE_PROFILE_PIC_SUCCESS,
  UPDATE_PROFILE_PIC_FAIL,
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

export function updateProfilePicRequest(payload) {
  return {
    type: UPDATE_PROFILE_PIC_REQUEST,
    payload,
  }
}

export function updateProfilePicSuccess(payload) {
  return {
    type: UPDATE_PROFILE_PIC_SUCCESS,
    payload,
  }
}

export function updateProfilePicFail(payload) {
  return {
    type: UPDATE_PROFILE_PIC_FAIL,
    payload,
  }
}

export function updateCoverImgRequest(payload) {
  return {
    type: UPDATE_COVER_IMG_REQUEST,
    payload,
  }
}

export function updateCoverImgSuccess(payload) {
  return {
    type: UPDATE_COVER_IMG_SUCCESS,
    payload,
  }
}

export function updateCoverImgFail(payload) {
  return {
    type: UPDATE_COVER_IMG_FAIL,
    payload,
  }
}
