import { INIT, GET_BROCHURE_REQUEST, GET_BROCHURE_SUCCESS, GET_BROCHURE_FAIL } from './constants'

const initialState = {
  detail: null,
  error: null,
  status: INIT,
}

export default function brochureReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_BROCHURE_REQUEST:
      return {
        ...state,
        detail: null,
        status: type,
      }

    case GET_BROCHURE_SUCCESS:
      return {
        ...state,
        detail: payload,
        status: type,
      }

    case GET_BROCHURE_FAIL:
      return {
        ...state,
        error: payload,
        status: type,
      }

    default:
      return state
  }
}
