/**
 * Gets the community info
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'

import request from 'utils/request'
import { setItem, getItem, removeItem } from 'utils/localStorage'

import { LOGIN_REQUEST, REGISTER_REQUEST, API_BASE_URL } from 'containers/App/constants'
import {
  loginSuccess,
  loginFail,
  registerSuccess,
  registerFail,
} from 'containers/App/actions'

import { FETCH_COMMUNITYINFO_REQUEST } from './constants'
import {
  fetchCommunityInfoSuccess,
  fetchCommunityInfoFail,
} from './actions'

export function* getCommunityInfoRequest() {
  const requestURL = `${API_BASE_URL}api/v1/community/info`

  const params = {
    method: 'GET',
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(fetchCommunityInfoSuccess(res))
  } catch (err) {
    yield put(fetchCommunityInfoFail(err))
  }
}

export function* getCommunityInfoRequestWatcher() {
  const watcher = yield takeLatest(FETCH_COMMUNITYINFO_REQUEST, getCommunityInfoRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* loginRequest(action) {
  const requestURL = `${API_BASE_URL}api/v1/auth/login`

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
    yield put(loginSuccess(res))
  } catch (err) {
    yield put(loginFail(err.details))
  }
}

export function* loginRequestWatcher() {
  const watcher = yield takeLatest(LOGIN_REQUEST, loginRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* registerRequest(action) {
  const requestURL = `${API_BASE_URL}api/v1/auth/register`

  const params = {
    method: 'POST',
    body: action.payload,
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res))
    yield put(registerSuccess(res))
  } catch (err) {
    yield put(registerFail(err.details))
  }
}

export function* registerRequestWatcher() {
  const watcher = yield takeLatest(REGISTER_REQUEST, registerRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export default [
  getCommunityInfoRequestWatcher,
  loginRequestWatcher,
  registerRequestWatcher,
]
