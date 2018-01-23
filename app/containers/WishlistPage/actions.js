import {
  GET_WISHLIST_REQUEST,
  GET_WISHLIST_SUCCESS,
  GET_WISHLIST_FAIL,
  DELETE_WISHLIST_REQUEST,
  DELETE_WISHLIST_SUCCESS,
  DELETE_WISHLIST_FAIL,
} from './constants'

export function getWishlistRequest(payload) {
  return {
    type: GET_WISHLIST_REQUEST,
    payload,
  }
}

export function getWishlistSuccess(payload) {
  return {
    type: GET_WISHLIST_SUCCESS,
    payload,
  }
}

export function getWishlistFail(payload) {
  return {
    type: GET_WISHLIST_FAIL,
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
