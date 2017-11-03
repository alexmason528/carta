import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'

import request from 'utils/request'
import { setItem, getItem, removeItem } from 'utils/localStorage'

import { API_BASE_URL, LOGIN_REQUEST, REGISTER_REQUEST, DELETE_USER_REQUEST, VERIFY_REQUEST, UPDATE_USER_REQUEST } from 'containers/App/constants'
import {
  loginSuccess,
  loginFail,
  registerSuccess,
  registerFail,
  deleteUserSuccess,
  deleteUserFail,
  verifySuccess,
  verifyFail,
  updateUserSuccess,
  updateUserFail,
} from 'containers/App/actions'

import { selectUser } from 'containers/App/selectors'

import { CREATE_POST_REQUEST, LIST_POST_REQUEST, UPDATE_POST_REQUEST, DELETE_POST_REQUEST, LIST_SUGGESTION_REQUEST } from './constants'
import {
  createPostSuccess,
  createPostFail,

  listPostSuccess,
  listPostFail,

  updatePostSuccess,
  updatePostFail,

  deletePostSuccess,
  deletePostFail,

  listSuggestionSuccess,
  listSuggestionFail,
} from './actions'

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

export function* registerRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/auth/register`

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
  const { id, password } = payload
  const requestURL = `${API_BASE_URL}api/v1/auth/${id}`

  const params = {
    method: 'DELETE',
    body: JSON.stringify({ password }),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(removeItem, 'auth')
    yield put(deleteUserSuccess())
  } catch (err) {
    yield put(deleteUserFail(err.details))
  }
}

export function* verifyRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/auth/verify`

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
    yield put(verifySuccess(res))
  } catch (err) {
    yield put(verifyFail(err.details))
  }
}

export function* createPostRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/post`

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    const user = yield select(selectUser())
    let info = {
      ...res,
      author: {
        ...user,
      },
    }
    yield put(createPostSuccess(info))
  } catch (err) {
    yield put(createPostFail(err.details))
  }
}

export function* listPostRequest() {
  const requestURL = `${API_BASE_URL}api/v1/post`

  const params = {
    method: 'GET',
  }

  try {
    const res = yield call(request, requestURL, params)
    const info = res.map(post => {
      return {
        ...post,
        author: post.author[0],
      }
    })

    yield put(listPostSuccess(info))
  } catch (err) {
    yield put(listPostFail(err.details))
  }
}

export function* updatePostRequest({ id, payload }) {
  const requestURL = `${API_BASE_URL}api/v1/post/${id}`

  const params = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    const user = yield select(selectUser())

    const { _id, title, img, content, link, created_at } = res
    const info = { _id, title, img, content, link, created_at }

    yield put(updatePostSuccess(info))
  } catch (err) {
    yield put(updatePostFail(err.details))
  }
}

export function* deletePostRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/post/${payload}`

  const params = {
    method: 'DELETE',
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(deletePostSuccess(payload))
  } catch (err) {
    yield put(deletePostFail(err.details))
  }
}

export function* listSuggestionRequest() {
  const requestURL = `${API_BASE_URL}api/v1/suggestion`

  const params = {
    method: 'GET',
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(listSuggestionSuccess(res))
  } catch (err) {
    yield put(listSuggestionFail(err.details))
  }
}

export function* updateUserRequest({ payload }) {
  const user = yield select(selectUser())
  const requestURL = `${API_BASE_URL}api/v1/auth/${user._id}`

  const params = {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res))
    yield put(updateUserSuccess(res))
  } catch (err) {
    yield put(updateUserFail(err.details))
  }
}

export function* loginRequestWatcher() {
  const watcher = yield takeLatest(LOGIN_REQUEST, loginRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* deleteUserWatcher() {
  const watcher = yield takeLatest(DELETE_USER_REQUEST, deleteUserRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* verifyRequestWatcher() {
  const watcher = yield takeLatest(VERIFY_REQUEST, verifyRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* createPostWatcher() {
  const watcher = yield takeLatest(CREATE_POST_REQUEST, createPostRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* listPostWatcher() {
  const watcher = yield takeLatest(LIST_POST_REQUEST, listPostRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* updatePostWatcher() {
  const watcher = yield takeLatest(UPDATE_POST_REQUEST, updatePostRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* deletePostWatcher() {
  const watcher = yield takeLatest(DELETE_POST_REQUEST, deletePostRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* listSuggestionWatcher() {
  const watcher = yield takeLatest(LIST_SUGGESTION_REQUEST, listSuggestionRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* updateUserWatcher() {
  const watcher = yield takeLatest(UPDATE_USER_REQUEST, updateUserRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export default [
  loginRequestWatcher,
  registerRequestWatcher,
  deleteUserWatcher,
  verifyRequestWatcher,
  listPostWatcher,
  createPostWatcher,
  updatePostWatcher,
  deletePostWatcher,
  listSuggestionWatcher,
  updateUserWatcher,
]
