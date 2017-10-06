/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true)
 */

import { getItem, removeItem } from '../../utils/localStorage'

// The initial state of the App
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,

  LOGOUT,
} from './constants'

// The initial state of the App

const initialState = {
  user: JSON.parse(getItem('auth')) || {},
  authenticated: !!getItem('auth'),
  login: {
    submitting: false,
    error: null,
  },
  register: {
    submitting: false,
    error: null,
  },
}

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        user: {},
        authenticated: false,
        login: {
          submitting: true,
          error: null,
        },
      }

    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        authenticated: true,
        login: {
          submitting: false,
          error: null,
        },
      }

    case LOGIN_ERROR:
      return {
        ...state,
        user: {},
        authenticated: false,
        login: {
          submitting: false,
          error: action.payload,
        },
      }

    case LOGOUT:
      removeItem('auth')
      return initialState

    default:
      return state
  }
}

export default appReducer
