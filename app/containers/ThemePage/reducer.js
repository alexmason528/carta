import {
  INIT,
  GET_THEMES_REQUEST,
  GET_THEMES_SUCCESS,
  GET_THEMES_FAIL,
} from './constants'

const initialState = {
  themes: [],
  error: null,
  status: INIT,
}

function themeReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_THEMES_REQUEST:
      return {
        ...state,
        themes: [],
        status: type,
        error: null,
      }

    case GET_THEMES_SUCCESS:
      return {
        ...state,
        themes: payload,
        status: type,
        error: null,
      }

    case GET_THEMES_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    default:
      return state
  }
}

export default themeReducer
