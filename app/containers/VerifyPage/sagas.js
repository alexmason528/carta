/**
 * Gets the community info
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'

import request from 'utils/request'

import { VERIFY_REQUEST, API_BASE_URL } from 'containers/App/constants'
import {
  verifySuccess,
  verifyFail,
} from 'containers/App/actions'

import { setItem, getItem, removeItem } from '../../utils/localStorage'

export function* verifyRequest(action) {
  const requestURL = `${API_BASE_URL}api/v1/auth/verify`

  const params = {
    method: 'POST',
    body: JSON.stringify(action.payload),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res))
    yield put(verifySuccess(res))
  } catch (err) {
    yield put(verifyFail(err.details))
  }
}

export function* verifyRequestWatcher() {
  const watcher = yield takeLatest(VERIFY_REQUEST, verifyRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export default [
  verifyRequestWatcher,
]
