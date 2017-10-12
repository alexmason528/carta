/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true)
 */
import {
  FETCH_COMMUNITYINFO_REQUEST,
  FETCH_COMMUNITYINFO_SUCCESS,
  FETCH_COMMUNITYINFO_FAIL,
} from './constants'

// The initial state of the App

const initialState = {
  community: {
    fetching: false,
    error: null,
    details: {
      posts: [],
      suggestions: [],
    },
  },
}

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_COMMUNITYINFO_REQUEST:
      return initialState

    case FETCH_COMMUNITYINFO_SUCCESS:
      return {
        ...state,
        community: {
          ...state.community,
          fetching: false,
          error: null,
          details: action.payload,
        },
      }

    case FETCH_COMMUNITYINFO_FAIL:
      return {
        ...state,
        community: {
          ...state.community,
          fetching: false,
          error: action.payload,
        },
      }

    default:
      return state
  }
}

export default homeReducer
