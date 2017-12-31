import { getItem, removeItem } from 'utils/localStorage'

import {
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  SIGNOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  VERIFY_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  CHANGE_AUTH_METHOD,
  TOGGLE_MENU,
} from './constants'

const initialState = {
  user: JSON.parse(getItem('auth')) || null,
  authenticated: !!getItem('auth'),
  status: null,
  error: null,
  authMethod: 'signIn',
  menuOpened: false,
}

function appReducer(state = initialState, { type, payload }) {
  let newState

  switch (type) {
    case SIGNIN_REQUEST:
      return {
        ...state,
        user: null,
        authenticated: false,
        status: type,
        error: null,
      }

    case SIGNIN_SUCCESS:
      return {
        ...state,
        user: payload,
        authenticated: true,
        status: type,
        error: null,
      }

    case SIGNIN_FAIL:
      newState = {
        ...state,
        user: null,
        authenticated: false,
        status: type,
        error: payload,
      }

      if (payload === 'carta.incorrectEmail') {
        newState.authMethod = 'register'
      }

      return newState

    case SIGNOUT:
      removeItem('auth')
      return {
        ...state,
        user: null,
        authenticated: false,
        status: type,
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
      newState = {
        ...state,
        user: null,
        authenticated: false,
        status: type,
        error: payload,
      }

      if (payload === 'carta.alreadyRegistered') {
        newState.authMethod = 'signIn'
      }

      return newState

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
        status: type,
        authenticated: false,
      }

    case DELETE_USER_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case UPDATE_USER_REQUEST:
      return {
        ...state,
        status: type,
      }

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        status: type,
        user: payload,
      }

    case UPDATE_USER_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case CHANGE_AUTH_METHOD:
      return {
        ...state,
        status: CHANGE_AUTH_METHOD,
        authMethod: payload,
        error: null,
      }

    case TOGGLE_MENU:
      return {
        ...state,
        menuOpened: !state.menuOpened,
      }

    default:
      return state
  }
}

export default appReducer
