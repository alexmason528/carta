import { getItem, removeItem } from '../../utils/localStorage'

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,

  LOGOUT,
} from './constants'

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
      return {
        ...state,
        user: {},
        authenticated: false,
      }

    default:
      return state
  }
}

export default appReducer
