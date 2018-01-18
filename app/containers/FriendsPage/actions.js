import {
  GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
  GET_FRIENDS_FAIL,
} from './constants'

export function getFriendsRequest() {
  return {
    type: GET_FRIENDS_REQUEST,
  }
}

export function getFriendsSuccess(payload) {
  return {
    type: GET_FRIENDS_SUCCESS,
    payload,
  }
}

export function getFriendsFail() {
  return {
    type: GET_FRIENDS_FAIL,
    payload,
  }
}
