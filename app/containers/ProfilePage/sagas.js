import { call, put, takeLatest } from 'redux-saga/effects'
import { API_BASE_URL } from 'containers/App/constants'
import request from 'utils/request'
import { GET_PROFILE_REQUEST } from './constants'
import { getProfileSuccess, getProfileFail } from './actions'

export function* getProfileRequestWatcher() {
  yield takeLatest(GET_PROFILE_REQUEST, getProfileRequestHandler)
}

export function* getProfileRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/theme?name=${payload}`

  const params = {
    method: 'GET',
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getProfileSuccess(res))
  } catch (err) {
    yield put(getProfileFail(err.toString()))
  }
}

export default [getProfileRequestWatcher]
