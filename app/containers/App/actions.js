import {
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  SIGNOUT,
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
  CHANGE_AUTH_METHOD,
  TOGGLE_MENU,
  GET_WISHLIST_REQUEST,
  GET_WISHLIST_SUCCESS,
  GET_WISHLIST_FAIL,
  CREATE_WISHLIST_REQUEST,
  CREATE_WISHLIST_SUCCESS,
  CREATE_WISHLIST_FAIL,
  DELETE_WISHLIST_REQUEST,
  DELETE_WISHLIST_SUCCESS,
  DELETE_WISHLIST_FAIL,
} from './constants'

export function signInRequest(payload) {
  return {
    type: SIGNIN_REQUEST,
    payload,
  }
}

export function signInSuccess(payload) {
  return {
    type: SIGNIN_SUCCESS,
    payload,
  }
}

export function signInFail(payload) {
  return {
    type: SIGNIN_FAIL,
    payload,
  }
}

export function signOut() {
  return {
    type: SIGNOUT,
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

export function getWishlistRequest() {
  return {
    type: GET_WISHLIST_REQUEST,
  }
}

export function getWishlistSuccess(payload) {
  return {
    type: GET_WISHLIST_SUCCESS,
    payload,
  }
}

export function getWishlistFail() {
  return {
    type: GET_WISHLIST_FAIL,
    payload,
  }
}

export function createWishlistRequest(payload) {
  return {
    type: CREATE_WISHLIST_REQUEST,
    payload,
  }
}

export function createWishlistSuccess(payload) {
  return {
    type: CREATE_WISHLIST_SUCCESS,
    payload,
  }
}

export function createWishlistFail(payload) {
  return {
    type: CREATE_WISHLIST_FAIL,
    payload,
  }
}

export function deleteWishlistRequest(payload) {
  return {
    type: DELETE_WISHLIST_REQUEST,
    payload,
  }
}

export function deleteWishlistSuccess(payload) {
  return {
    type: DELETE_WISHLIST_SUCCESS,
    payload,
  }
}

export function deleteWishlistFail(payload) {
  return {
    type: DELETE_WISHLIST_FAIL,
    payload,
  }
}
