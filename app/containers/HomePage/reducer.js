import { findIndex } from 'lodash'

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

const initialState = {
  posts: [],
  suggestions: [],
  curPost: null,
  status: null,
  error: null,
}

function homeReducer(state = initialState, action) {
  const { type, payload, id } = action

  switch (type) {
    case CREATE_POST_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case CREATE_POST_SUCCESS:
      return {
        ...state,
        posts: [
          payload,
          ...state.posts,
        ],
        status: type,
        error: payload,
      }

    case CREATE_POST_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case LIST_POST_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case LIST_POST_SUCCESS:
      return {
        ...state,
        status: type,
        posts: payload,
      }

    case LIST_POST_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case UPDATE_POST_REQUEST:
      return {
        ...state,
        curPost: id,
        status: type,
        error: null,
      }

    case UPDATE_POST_SUCCESS:
      const newPosts = state.posts.map(post => {
        if (post._id !== payload._id) return post
        return {
          ...post,
          ...payload,
        }
      })

      return {
        ...state,
        curPost: null,
        posts: newPosts,
        status: type,
      }

    case UPDATE_POST_FAIL:
      return {
        ...state,
        curPost: null,
        status: type,
        error: payload,
      }

    case DELETE_POST_REQUEST:
      return {
        ...state,
        curPost: payload,
        status: type,
        error: null,
      }

    case DELETE_POST_SUCCESS:
      return {
        ...state,
        curPost: null,
        status: type,
        posts: state.posts.filter(post => post._id !== payload),
      }

    case DELETE_POST_FAIL:
      return {
        ...state,
        curPost: null,
        status: type,
        error: payload,
      }

    case LIST_SUGGESTION_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case LIST_SUGGESTION_SUCCESS:
      return {
        ...state,
        status: type,
        suggestions: payload,
      }

    case LIST_SUGGESTION_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case DELETE_USER_POSTS:
      return {
        ...state,
        status: type,
        error: null,
        posts: state.posts.filter(post => post.author._id !== payload),
      }

    default:
      return state
  }
}

export default homeReducer
