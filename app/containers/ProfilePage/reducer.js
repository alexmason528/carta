import {
  INIT,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
} from './constants'

const initialState = {
  profile: [],
  error: null,
  status: INIT,
}

function profileReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_PROFILE_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        profile: payload,
        status: type,
        error: null,
      }

    case GET_PROFILE_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    default:
      return state
  }
}

export default profileReducer
