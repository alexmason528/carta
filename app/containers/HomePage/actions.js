import {
  FETCH_COMMUNITYINFO_REQUEST,
  FETCH_COMMUNITYINFO_SUCCESS,
  FETCH_COMMUNITYINFO_FAIL,

  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAIL,

  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAIL,
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

export function updatePostRequest(id, payload) {
  return {
    type: UPDATE_POST_REQUEST,
    id,
    payload,
  }
}

export function updatePostSuccess(payload) {
  return {
    type: UPDATE_POST_SUCCESS,
    payload,
  }
}

export function updatePostFail(payload) {
  return {
    type: UPDATE_POST_FAIL,
    payload,
  }
}

export function deletePostRequest(payload) {
  return {
    type: DELETE_POST_REQUEST,
    payload,
  }
}

export function deletePostSuccess(payload) {
  return {
    type: DELETE_POST_SUCCESS,
    payload,
  }
}

export function deletePostFail(payload) {
  return {
    type: DELETE_POST_FAIL,
    payload,
  }
}
