import { call, put, takeLatest } from 'redux-saga/effects'
import { API_BASE_URL } from 'utils/globalConstants'
import request from 'utils/request'
import { GET_BROCHURE_REQUEST } from './constants'
import { getBrochureSuccess, getBrochureFail } from './actions'

export function* getBrochureRequestWatcher() {
  yield takeLatest(GET_BROCHURE_REQUEST, getBrochureHandler)
}

export function* getBrochureHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/brochure/${payload}`

  const params = { method: 'GET' }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getBrochureSuccess(res))
  } catch (err) {
    yield put(getBrochureFail(err.details))
  }
}

export default [getBrochureRequestWatcher]
