import { INIT, GET_PLACES_REQUEST, GET_PLACES_SUCCESS, GET_PLACES_FAIL } from './constants'

const initialState = {
  places: [],
  error: null,
  status: INIT,
}

function placeReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_PLACES_REQUEST:
      return {
        ...state,
        places: [],
        status: type,
        error: null,
      }

    case GET_PLACES_SUCCESS:
      return {
        ...state,
        places: payload,
        status: type,
        error: null,
      }

    case GET_PLACES_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    default:
      return state
  }
}

export default placeReducer
