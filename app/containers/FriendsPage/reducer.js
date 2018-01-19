import {
  INIT,
  GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
  GET_FRIENDS_FAIL,
  UPDATE_HOLIDAY_PIC_REQUEST,
  UPDATE_HOLIDAY_PIC_SUCCESS,
  UPDATE_HOLIDAY_PIC_FAIL,
} from './constants'

const initialState = {
  fullname: null,
  holidayPic: null,
  friends: [],
  error: null,
  status: INIT,
}

function friendsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_FRIENDS_REQUEST:
      return initialState

    case GET_FRIENDS_SUCCESS:
      return {
        ...state,
        ...payload,
        status: type,
        error: null,
      }

    case GET_FRIENDS_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case UPDATE_HOLIDAY_PIC_REQUEST:
      return {
        ...state,
        state: type,
        error: null,
      }

    case UPDATE_HOLIDAY_PIC_SUCCESS:
      return {
        ...state,
        state: type,
        holidayPic: payload,
      }

    case UPDATE_HOLIDAY_PIC_FAIL:
      return {
        ...state,
        state: type,
        error: payload,
      }

    default:
      return state
  }
}

export default friendsReducer
