import {
  FETCH_COMMUNITYINFO_REQUEST,
  FETCH_COMMUNITYINFO_SUCCESS,
  FETCH_COMMUNITYINFO_FAIL,
} from './constants'

export function fetchCommunityInfoRequest() {
  return {
    type: FETCH_COMMUNITYINFO_REQUEST,
  }
}

export function fetchCommunityInfoSuccess(payload) {
  return {
    type: FETCH_COMMUNITYINFO_SUCCESS,
    payload,
  }
}

export function fetchCommunityInfoFail(payload) {
  return {
    type: FETCH_COMMUNITYINFO_FAIL,
    payload,
  }
}
