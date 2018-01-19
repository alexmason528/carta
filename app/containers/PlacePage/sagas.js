import { call, put, takeLatest } from 'redux-saga/effects'
import { API_BASE_URL } from 'utils/globalConstants'
import request from 'utils/request'
import { GET_PLACES_REQUEST } from './constants'
import { getPlacesSuccess, getPlacesFail } from './actions'

export function* getPlacesRequestWatcher() {
  yield takeLatest(GET_PLACES_REQUEST, getPlacesRequestHandler)
}

export function* getPlacesRequestHandler() {
  const requestURL = `${API_BASE_URL}api/v1/place/`

  const params = {
    method: 'GET',
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getPlacesSuccess(res))
  } catch (err) {
    yield put(getPlacesFail(err.details))
  }
}

export default [getPlacesRequestWatcher]
