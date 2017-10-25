import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'

import request from 'utils/request'
import { setItem, getItem, removeItem } from 'utils/localStorage'

import { API_BASE_URL, LOGIN_REQUEST, REGISTER_REQUEST, DELETE_USER_REQUEST, VERIFY_REQUEST } from 'containers/App/constants'
import {
  loginSuccess,
  loginFail,
  registerSuccess,
  registerFail,
  deleteUserSuccess,
  deleteUserFail,
  verifySuccess,
  verifyFail,
} from 'containers/App/actions'

import { DELETE_USER, FETCH_COMMUNITYINFO_REQUEST } from './constants'
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

export function* loginRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/auth/login`

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
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

export function* registerRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/auth/register`

  const params = {
    method: 'POST',
    body: payload,
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

export function* deleteUserRequest({ payload }) {
  const request = `${API_BASE_URL}api/v1/auth/delete`
  const params = {
    method: 'POST',
    body: payload,
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(removeItem, 'auth')
    yield put(deleteUserSuccess())
  } catch (err) {
    yield put(deleteUserFail(err.details))
  }
}

export function* deleteUserWatcher() {
  const watcher = yield takeLatest(DELETE_USER_REQUEST, deleteUserRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

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
  getCommunityInfoRequestWatcher,
  loginRequestWatcher,
  registerRequestWatcher,
  deleteUserWatcher,
  verifyRequestWatcher,
]
