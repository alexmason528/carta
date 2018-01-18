import {
  INIT,
  GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
  GET_FRIENDS_FAIL,
} from './constants'

const initialState = {
  friends: [],
  error: null,
  status: INIT,
}

function friendsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_FRIENDS_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case GET_FRIENDS_SUCCESS:
      return {
        ...state,
        friends: payload,
        status: type,
        error: null,
      }

    case GET_FRIENDS_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    default:
      return state
  }
}

export default friendsReducer
