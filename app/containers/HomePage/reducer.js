import { findIndex } from 'lodash'

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
    case FETCH_COMMUNITYINFO_REQUEST:
      return initialState

    case FETCH_COMMUNITYINFO_SUCCESS:
      return {
        ...state,
        ...payload,
        status: type,
        error: null,
      }

    case FETCH_COMMUNITYINFO_FAIL:
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

    default:
      return state
  }
}

export default homeReducer
