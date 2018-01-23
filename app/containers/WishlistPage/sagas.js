import { call, put, takeLatest } from 'redux-saga/effects'
import { API_BASE_URL } from 'utils/globalConstants'
import request from 'utils/request'
import { GET_WISHLIST_REQUEST, DELETE_WISHLIST_REQUEST } from './constants'
import { getWishlistSuccess, getWishlistFail, deleteWishlistSuccess, deleteWishlistFail } from './actions'

export function* getWishlistWatcher() {
  yield takeLatest(GET_WISHLIST_REQUEST, getWishlistRequestHandler)
}

export function* getWishlistRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/wishlist/${payload}`
  const params = { method: 'GET' }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getWishlistSuccess(res))
  } catch (err) {
    yield put(getWishlistFail(err.details))
  }
}

export function* deleteWishlistWatcher() {
  yield takeLatest(DELETE_WISHLIST_REQUEST, deleteWishlistRequestHandler)
}

export function* deleteWishlistRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/wishlist/${payload}`
  const params = { method: 'DELETE' }

  try {
    const res = yield call(request, requestURL, params)
    yield put(deleteWishlistSuccess(res))
  } catch (err) {
    yield put(deleteWishlistFail(err.details))
  }
}

export default [getWishlistWatcher, deleteWishlistWatcher]
