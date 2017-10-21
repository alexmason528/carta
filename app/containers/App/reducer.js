import { getItem, removeItem } from 'utils/localStorage'

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,

  LOGOUT,

  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,

  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  VERIFY_FAIL,
} from './constants'

const initialState = {
  user: JSON.parse(getItem('auth')) || null,
  authenticated: !!getItem('auth'),
  status: null,
  error: null,
}

function appReducer(state = initialState, { type, payload }) {
  switch (type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        user: null,
        authenticated: false,
        status: type,
        error: null,
      }

    case LOGIN_SUCCESS:
      return {
        ...state,
        user: payload,
        authenticated: true,
        status: type,
        error: null,
      }

    case LOGIN_FAIL:
      return {
        ...state,
        user: null,
        authenticated: false,
        status: type,
        error: payload,
      }

    case LOGOUT:
      removeItem('auth')
      return {
        ...state,
        user: null,
        authenticated: false,
        state: type,
        error: null,
      }

    case REGISTER_REQUEST:
      return {
        ...state,
        user: null,
        authenticated: false,
        status: type,
        error: null,
      }

    case REGISTER_SUCCESS:
      return {
        ...state,
        user: payload,
        authenticated: true,
        status: type,
        error: null,
      }

    case REGISTER_FAIL:
      return {
        ...state,
        user: null,
        authenticated: false,
        status: type,
        error: payload,
      }

    case VERIFY_REQUEST:
      return {
        ...state,
        user: {
          ...state.user,
          verified: false,
        },
        status: type,
        error: null,
      }

    case VERIFY_SUCCESS:
      return {
        ...state,
        user: payload,
        authenticated: true,
        status: type,
        error: null,
      }

    case VERIFY_FAIL:
      return {
        ...state,
        user: {
          ...state.user,
          verified: false,
        },
        status: type,
        error: payload,
      }

    default:
      return state
  }
}

export default appReducer
