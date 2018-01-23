import {
  SIGNIN_USER_REQUEST,
  SIGNIN_USER_SUCCESS,
  SIGNIN_USER_FAIL,
  SIGNOUT_USER,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  VERIFY_USER_REQUEST,
  VERIFY_USER_SUCCESS,
  VERIFY_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  GET_USER_WISHLIST_REQUEST,
  GET_USER_WISHLIST_SUCCESS,
  GET_USER_WISHLIST_FAIL,
  CREATE_USER_WISHLIST_REQUEST,
  CREATE_USER_WISHLIST_SUCCESS,
  CREATE_USER_WISHLIST_FAIL,
  DELETE_USER_WISHLIST_REQUEST,
  DELETE_USER_WISHLIST_SUCCESS,
  DELETE_USER_WISHLIST_FAIL,
  CHANGE_AUTH_METHOD,
  TOGGLE_MENU,
} from './constants'

export function signInUserRequest(payload) {
  return {
    type: SIGNIN_USER_REQUEST,
    payload,
  }
}

export function signInUserSuccess(payload) {
  return {
    type: SIGNIN_USER_SUCCESS,
    payload,
  }
}

export function signInUserFail(payload) {
  return {
    type: SIGNIN_USER_FAIL,
    payload,
  }
}

export function signOutUser() {
  return {
    type: SIGNOUT_USER,
  }
}

export function registerUserRequest(payload) {
  return {
    type: REGISTER_USER_REQUEST,
    payload,
  }
}

export function registerUserSuccess(payload) {
  return {
    type: REGISTER_USER_SUCCESS,
    payload,
  }
}

export function registerUserFail(payload) {
  return {
    type: REGISTER_USER_FAIL,
    payload,
  }
}

export function verifyUserRequest(payload) {
  return {
    type: VERIFY_USER_REQUEST,
    payload,
  }
}

export function verifyUserSuccess(payload) {
  return {
    type: VERIFY_USER_SUCCESS,
    payload,
  }
}

export function verifyUserFail(payload) {
  return {
    type: VERIFY_USER_FAIL,
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
    type: DELETE_USER_SUCCESS,
  }
}

export function deleteUserFail(payload) {
  return {
    type: DELETE_USER_FAIL,
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

export function changeAuthMethod(payload) {
  return {
    type: CHANGE_AUTH_METHOD,
    payload,
  }
}

export function toggleMenu() {
  return {
    type: TOGGLE_MENU,
  }
}

export function getUserWishlistRequest() {
  return {
    type: GET_USER_WISHLIST_REQUEST,
  }
}

export function getUserWishlistSuccess(payload) {
  return {
    type: GET_USER_WISHLIST_SUCCESS,
    payload,
  }
}

export function getUserWishlistFail(payload) {
  return {
    type: GET_USER_WISHLIST_FAIL,
    payload,
  }
}

export function createUserWishlistRequest(payload) {
  return {
    type: CREATE_USER_WISHLIST_REQUEST,
    payload,
  }
}

export function createUserWishlistSuccess(payload) {
  return {
    type: CREATE_USER_WISHLIST_SUCCESS,
    payload,
  }
}

export function createUserWishlistFail(payload) {
  return {
    type: CREATE_USER_WISHLIST_FAIL,
    payload,
  }
}

export function deleteUserWishlistRequest(payload) {
  return {
    type: DELETE_USER_WISHLIST_REQUEST,
    payload,
  }
}

export function deleteUserWishlistSuccess(payload) {
  return {
    type: DELETE_USER_WISHLIST_SUCCESS,
    payload,
  }
}

export function deleteUserWishlistFail(payload) {
  return {
    type: DELETE_USER_WISHLIST_FAIL,
    payload,
  }
}
