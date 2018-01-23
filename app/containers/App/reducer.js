import { isEqual } from 'lodash'
import { getItem, setItem, removeItem } from 'utils/localStorage'

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
  GET_WISHLIST_REQUEST,
  GET_WISHLIST_SUCCESS,
  GET_WISHLIST_FAIL,
  CREATE_WISHLIST_REQUEST,
  CREATE_WISHLIST_SUCCESS,
  CREATE_WISHLIST_FAIL,
  DELETE_WISHLIST_REQUEST,
  DELETE_WISHLIST_SUCCESS,
  DELETE_WISHLIST_FAIL,
} from './constants'

const initialState = {
  user: JSON.parse(getItem('auth')) || null,
  authenticated: !!getItem('auth'),
  status: null,
  error: null,
  authMethod: 'signIn',
  menuOpened: false,
  wishlist: JSON.parse(getItem('wishlist')) || [],
}

function appReducer(state = initialState, { type, payload }) {
  let newState
  let newWishlist

  switch (type) {
    case SIGNIN_REQUEST:
    case REGISTER_REQUEST:
    case VERIFY_REQUEST:
    case DELETE_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case GET_WISHLIST_REQUEST:
    case CREATE_WISHLIST_REQUEST:
    case DELETE_WISHLIST_REQUEST:
      return {
        ...state,
        status: type,
      }

    case SIGNIN_SUCCESS:
      return {
        ...state,
        ...payload,
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
      removeItem('wishlist')
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

    case DELETE_USER_SUCCESS:
      removeItem('auth')
      removeItem('wishlist')
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
        status: type,
        authMethod: payload,
        error: null,
      }

    case TOGGLE_MENU:
      return {
        ...state,
        status: type,
        menuOpened: !state.menuOpened,
      }

    case GET_WISHLIST_SUCCESS:
      setItem('wishlist', payload)
      return {
        ...state,
        status: type,
        wishlist: payload,
      }

    case CREATE_WISHLIST_SUCCESS:
      newWishlist = [...state.wishlist, payload]
      setItem('wishlist', newWishlist)

      return {
        ...state,
        status: type,
        wishlist: newWishlist,
      }

    case CREATE_WISHLIST_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case DELETE_WISHLIST_SUCCESS:
      newWishlist = state.wishlist.filter(entry => !isEqual(entry, payload))
      setItem('wishlist', newWishlist)

      return {
        ...state,
        status: type,
        wishlist: newWishlist,
      }

    case DELETE_WISHLIST_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    default:
      return state
  }
}

export default appReducer
