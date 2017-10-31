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

  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,

  UPDATE_COVER_IMG_REQUEST,
  UPDATE_COVER_IMG_SUCCESS,
  UPDATE_COVER_IMG_FAIL,

  UPDATE_PROFILE_PIC_REQUEST,
  UPDATE_PROFILE_PIC_SUCCESS,
  UPDATE_PROFILE_PIC_FAIL,
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
        status: type,
        error: payload,
      }

    case DELETE_USER_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case DELETE_USER_SUCCESS:
      removeItem('auth')
      return {
        ...state,
        user: null,
        authenticated: false,
      }

    case DELETE_USER_FAIL:
      return {
        ...state,
        error: payload,
      }

    case UPDATE_PROFILE_PIC_REQUEST:
      return {
        ...state,
        status: type,
      }

    case UPDATE_PROFILE_PIC_SUCCESS:
      return {
        ...state,
        status: type,
        user: payload,
      }

    case UPDATE_PROFILE_PIC_FAIL:
      return {
        ...state,
        state: type,
        error: payload,
      }

    case UPDATE_COVER_IMG_REQUEST:
      return {
        ...state,
        status: type,
      }

    case UPDATE_COVER_IMG_SUCCESS:
      return {
        ...state,
        status: type,
        user: payload,
      }

    case UPDATE_COVER_IMG_FAIL:
      return {
        ...state,
        state: type,
        error: payload,
      }

    default:
      return state
  }
}

export default appReducer
