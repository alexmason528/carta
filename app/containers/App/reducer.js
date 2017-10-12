import { getItem, removeItem } from '../../utils/localStorage'

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
  login: {
    submitting: false,
    error: null,
  },
  register: {
    submitting: false,
    error: null,
  },
  verify: {
    submitting: false,
    error: null,
  },
}

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        user: null,
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

    case LOGIN_FAIL:
      return {
        ...state,
        user: null,
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
        user: null,
        authenticated: false,
      }

    case REGISTER_REQUEST:
      return {
        ...state,
        user: null,
        authenticated: false,
        register: {
          submitting: true,
          error: null,
        },
      }

    case REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        authenticated: true,
        register: {
          submitting: false,
          error: null,
        },
      }

    case REGISTER_FAIL:
      return {
        ...state,
        user: null,
        authenticated: false,
        register: {
          submitting: false,
          error: action.payload,
        },
      }

    case VERIFY_REQUEST:
      return {
        ...state,
        user: {
          ...state.user,
          verified: false,
        },
        verify: {
          submitting: true,
          error: null,
        },
      }

    case VERIFY_SUCCESS:
      return {
        ...state,
        user: action.payload,
        authenticated: true,
        verify: {
          submitting: false,
          error: null,
        },
      }

    case VERIFY_FAIL:
      return {
        ...state,
        user: {
          ...state.user,
          verified: false,
        },
        verify: {
          submitting: false,
          error: action.payload,
        },
      }

    default:
      return state
  }
}

export default appReducer
