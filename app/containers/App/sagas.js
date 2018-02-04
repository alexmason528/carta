import { call, put, select, takeLatest } from 'redux-saga/effects'
import { setItem, removeItem } from 'utils/localStorage'
import { deleteUserPosts } from 'containers/HomePage/actions'
import { API_BASE_URL } from 'utils/globalConstants'
import request from 'utils/request'
import {
  SIGNIN_USER_REQUEST,
  REGISTER_USER_REQUEST,
  DELETE_USER_REQUEST,
  VERIFY_USER_REQUEST,
  UPDATE_USER_REQUEST,
  GET_USER_WISHLIST_REQUEST,
  CREATE_USER_WISHLIST_REQUEST,
  DELETE_USER_WISHLIST_REQUEST,
} from './constants'
import {
  signInUserSuccess,
  signInUserFail,
  registerUserSuccess,
  registerUserFail,
  deleteUserSuccess,
  deleteUserFail,
  verifyUserSuccess,
  verifyUserFail,
  updateUserSuccess,
  updateUserFail,
  getUserWishlistSuccess,
  getUserWishlistFail,
  createUserWishlistSuccess,
  createUserWishlistFail,
  deleteUserWishlistSuccess,
  deleteUserWishlistFail,
} from './actions'
import { selectUser } from './selectors'

export function* signInUserRequestWatcher() {
  yield takeLatest(SIGNIN_USER_REQUEST, signInUserRequestHandler)
}

export function* signInUserRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/auth/signIn`
  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res.user))
    yield call(setItem, 'wishlist', JSON.stringify(res.wishlist))
    yield put(signInUserSuccess(res))
  } catch (err) {
    yield put(signInUserFail(err.details))
  }
}

export function* registerUserRequestWatcher() {
  yield takeLatest(REGISTER_USER_REQUEST, registerUserRequestHandler)
}

export function* registerUserRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/auth/register`

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res))
    yield put(registerUserSuccess(res))
  } catch (err) {
    yield put(registerUserFail(err.details))
  }
}

export function* deleteUserWatcher() {
  yield takeLatest(DELETE_USER_REQUEST, deleteUserRequestHandler)
}

export function* deleteUserRequestHandler({ payload }) {
  const { id, password } = payload
  const requestURL = `${API_BASE_URL}api/v1/auth/${id}`

  const params = {
    method: 'DELETE',
    body: JSON.stringify({ password }),
    headers: { 'Content-Type': 'application/json' },
  }

  try {
    yield call(request, requestURL, params)
    yield call(removeItem, 'auth')
    yield put(deleteUserSuccess())
    yield put(deleteUserPosts(id))
  } catch (err) {
    yield put(deleteUserFail(err.details))
  }
}

export function* verifyUserRequestWatcher() {
  yield takeLatest(VERIFY_USER_REQUEST, verifyUserRequestHandler)
}

export function* verifyUserRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/auth/verify`

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res))
    yield put(verifyUserSuccess(res))
  } catch (err) {
    yield put(verifyUserFail(err.details))
  }
}

export function* updateUserWatcher() {
  yield takeLatest(UPDATE_USER_REQUEST, updateUserRequest)
}

export function* updateUserRequest({ payload }) {
  const user = yield select(selectUser())
  const requestURL = `${API_BASE_URL}api/v1/auth/${user._id}`

  const params = {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res))
    yield put(updateUserSuccess(res))
  } catch (err) {
    yield put(updateUserFail(err.details))
  }
}

export function* getUserWishlistWatcher() {
  yield takeLatest(GET_USER_WISHLIST_REQUEST, getUserWishlistRequestHandler)
}

export function* getUserWishlistRequestHandler() {
  const user = yield select(selectUser())
  const requestURL = `${API_BASE_URL}api/v1/wishlist/${user.username}`
  const params = { method: 'GET' }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getUserWishlistSuccess(res))
  } catch (err) {
    yield put(getUserWishlistFail(err.details))
  }
}

export function* createUserWishlistWatcher() {
  yield takeLatest(CREATE_USER_WISHLIST_REQUEST, createUserWishlistRequestHandler)
}

export function* createUserWishlistRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/wishlist`

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(createUserWishlistSuccess(res))
  } catch (err) {
    yield put(createUserWishlistFail(err.details))
  }
}

export function* deleteUserWishlistWatcher() {
  yield takeLatest(DELETE_USER_WISHLIST_REQUEST, deleteUserWishlistRequestHandler)
}

export function* deleteUserWishlistRequestHandler({ payload }) {
  const { userID, brochureID } = payload
  const requestURL = `${API_BASE_URL}api/v1/wishlist/${brochureID}/user/${userID}`
  const params = { method: 'DELETE' }

  try {
    const res = yield call(request, requestURL, params)
    yield put(deleteUserWishlistSuccess(res))
  } catch (err) {
    yield put(deleteUserWishlistFail(err.details))
  }
}

export default [
  signInUserRequestWatcher,
  registerUserRequestWatcher,
  deleteUserWatcher,
  verifyUserRequestWatcher,
  updateUserWatcher,
  getUserWishlistWatcher,
  createUserWishlistWatcher,
  deleteUserWishlistWatcher,
]
