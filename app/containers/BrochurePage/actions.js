import { GET_BROCHURE_REQUEST, GET_BROCHURE_SUCCESS, GET_BROCHURE_FAIL } from './constants'

export function getBrochureRequest(payload) {
  return {
    type: GET_BROCHURE_REQUEST,
    payload,
  }
}

export function getBrochureSuccess(payload) {
  return {
    type: GET_BROCHURE_SUCCESS,
    payload,
  }
}

export function getBrochureFail(payload) {
  return {
    type: GET_BROCHURE_FAIL,
    payload,
  }
}
