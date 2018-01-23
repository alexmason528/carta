import {
  INIT,
  GET_WISHLIST_REQUEST,
  GET_WISHLIST_SUCCESS,
  GET_WISHLIST_FAIL,
  DELETE_WISHLIST_REQUEST,
  DELETE_WISHLIST_SUCCESS,
  DELETE_WISHLIST_FAIL,
} from './constants'

const initialState = {
  wishlist: [],
  error: null,
  status: INIT,
}

function wishlistReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_WISHLIST_REQUEST:
    case DELETE_WISHLIST_REQUEST:
      return {
        ...state,
        status: type,
      }

    case GET_WISHLIST_FAIL:
    case DELETE_WISHLIST_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case GET_WISHLIST_SUCCESS:
      return {
        ...state,
        status: type,
        wishlist: payload,
      }

    case DELETE_WISHLIST_SUCCESS:
      return {
        ...state,
        status: type,
        wishlist: state.wishlist.filter(entry => entry.id !== payload),
      }

    default:
      return state
  }
}

export default wishlistReducer
