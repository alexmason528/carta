import { difference } from 'lodash'
import { getItem, setItem, removeItem } from 'utils/localStorage'
import { initialParam, initialViewport } from 'utils/globalConstants'

import {
  SIGNIN_USER_REQUEST,
  SIGNIN_USER_SUCCESS,
  SIGNIN_USER_FAIL,
  SIGNOUT_USER,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  VERIFY_USER_REQUEST,
  VERIFY_USER_SUCCESS,
  VERIFY_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  CHANGE_AUTH_METHOD,
  TOGGLE_MENU,
  GET_USER_WISHLIST_REQUEST,
  GET_USER_WISHLIST_SUCCESS,
  GET_USER_WISHLIST_FAIL,
  CREATE_USER_WISHLIST_REQUEST,
  CREATE_USER_WISHLIST_SUCCESS,
  CREATE_USER_WISHLIST_FAIL,
  DELETE_USER_WISHLIST_REQUEST,
  DELETE_USER_WISHLIST_SUCCESS,
  DELETE_USER_WISHLIST_FAIL,
} from './constants'

if (!getItem('viewport')) {
  setItem('viewport', JSON.stringify(initialViewport))
}

if (!getItem('quests')) {
  setItem('quests', JSON.stringify([initialParam]))
  setItem('curQuestInd', 0)
}

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
    case SIGNIN_USER_REQUEST:
    case REGISTER_USER_REQUEST:
    case VERIFY_USER_REQUEST:
    case DELETE_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case GET_USER_WISHLIST_REQUEST:
    case CREATE_USER_WISHLIST_REQUEST:
    case DELETE_USER_WISHLIST_REQUEST:
      return {
        ...state,
        status: type,
      }

    case SIGNIN_USER_SUCCESS:
      return {
        ...state,
        ...payload,
        authenticated: true,
        status: type,
        error: null,
      }

    case SIGNIN_USER_FAIL:
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

    case SIGNOUT_USER:
      removeItem('auth')
      removeItem('wishlist')
      return {
        ...state,
        user: null,
        authenticated: false,
        status: type,
        error: null,
      }

    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        user: payload,
        authenticated: true,
        status: type,
        error: null,
      }

    case REGISTER_USER_FAIL:
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

    case VERIFY_USER_SUCCESS:
      return {
        ...state,
        user: payload,
        authenticated: true,
        status: type,
        error: null,
      }

    case VERIFY_USER_FAIL:
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

    case GET_USER_WISHLIST_SUCCESS:
      setItem('wishlist', JSON.stringify(payload))

      return {
        ...state,
        status: type,
        wishlist: payload,
      }

    case GET_USER_WISHLIST_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case CREATE_USER_WISHLIST_SUCCESS:
      newWishlist = [...state.wishlist, payload]
      setItem('wishlist', JSON.stringify(newWishlist))

      return {
        ...state,
        status: type,
        wishlist: newWishlist,
      }

    case CREATE_USER_WISHLIST_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case DELETE_USER_WISHLIST_SUCCESS:
      const { userID, brochureID } = payload
      const deleteList = state.wishlist.filter(entry => entry.userID === userID && entry.brochureID === brochureID)
      newWishlist = difference(state.wishlist, deleteList)
      setItem('wishlist', JSON.stringify(newWishlist))

      return {
        ...state,
        status: type,
        wishlist: newWishlist,
      }

    case DELETE_USER_WISHLIST_FAIL:
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
