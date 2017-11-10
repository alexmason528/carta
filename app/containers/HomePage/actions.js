import {
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAIL,

  LIST_POST_REQUEST,
  LIST_POST_SUCCESS,
  LIST_POST_FAIL,

  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAIL,

  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAIL,

  LIST_SUGGESTION_REQUEST,
  LIST_SUGGESTION_SUCCESS,
  LIST_SUGGESTION_FAIL,

  DELETE_USER_POSTS,
} from './constants'

export function createPostRequest(payload) {
  return {
    type: CREATE_POST_REQUEST,
    payload,
  }
}

export function createPostSuccess(payload) {
  return {
    type: CREATE_POST_SUCCESS,
    payload,
  }
}

export function createPostFail(payload) {
  return {
    type: CREATE_POST_FAIL,
    payload,
  }
}

export function listPostRequest() {
  return {
    type: LIST_POST_REQUEST,
  }
}

export function listPostSuccess(payload) {
  return {
    type: LIST_POST_SUCCESS,
    payload,
  }
}

export function listPostFail(payload) {
  return {
    type: LIST_POST_FAIL,
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

export function listSuggestionRequest() {
  return {
    type: LIST_SUGGESTION_REQUEST,
  }
}

export function listSuggestionSuccess(payload) {
  return {
    type: LIST_SUGGESTION_SUCCESS,
    payload,
  }
}

export function listSuggestionFail(payload) {
  return {
    type: LIST_SUGGESTION_FAIL,
    payload,
  }
}

export function deleteUserPosts(payload) {
  return {
    type: DELETE_USER_POSTS,
    payload,
  }
}
