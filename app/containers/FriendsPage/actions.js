import {
  GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
  GET_FRIENDS_FAIL,
  UPDATE_HOLIDAY_PIC_REQUEST,
  UPDATE_HOLIDAY_PIC_SUCCESS,
  UPDATE_HOLIDAY_PIC_FAIL,
} from './constants'

export function getFriendsRequest(payload) {
  return {
    type: GET_FRIENDS_REQUEST,
    payload,
  }
}

export function getFriendsSuccess(payload) {
  return {
    type: GET_FRIENDS_SUCCESS,
    payload,
  }
}

export function getFriendsFail(payload) {
  return {
    type: GET_FRIENDS_FAIL,
    payload,
  }
}

export function updateHolidayPicRequest(payload) {
  return {
    type: UPDATE_HOLIDAY_PIC_REQUEST,
    payload,
  }
}

export function updateHolidayPicSuccess(payload) {
  return {
    type: UPDATE_HOLIDAY_PIC_SUCCESS,
    payload,
  }
}

export function updateHolidayPicFail(payload) {
  return {
    type: UPDATE_HOLIDAY_PIC_FAIL,
    payload,
  }
}
