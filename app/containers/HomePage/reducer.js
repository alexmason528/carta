import {
  FETCH_COMMUNITYINFO_REQUEST,
  FETCH_COMMUNITYINFO_SUCCESS,
  FETCH_COMMUNITYINFO_FAIL,

  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAIL,
} from './constants'

const initialState = {
  posts: [],
  suggestions: [],
  status: null,
  error: null,
}

function homeReducer(state = initialState, { type, payload }) {
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
        status: typye,
      }

    case UPDATE_POST_SUCCESS:
      return {
        ...state,
        status: type,
      }

    case UPDATE_POST_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    default:
      return state
  }
}

export default homeReducer
