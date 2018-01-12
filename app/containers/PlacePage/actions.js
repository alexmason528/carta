import {
  GET_PLACES_REQUEST,
  GET_PLACES_SUCCESS,
  GET_PLACES_FAIL,
} from './constants'

export function getPlacesRequest() {
  return {
    type: GET_PLACES_REQUEST,
  }
}

export function getPlacesSuccess(payload) {
  return {
    type: GET_PLACES_SUCCESS,
    payload,
  }
}

export function getPlacesFail() {
  return {
    type: GET_PLACES_FAIL,
    payload,
  }
}
