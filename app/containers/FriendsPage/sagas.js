import { call, put, takeLatest } from 'redux-saga/effects'
import { API_BASE_URL } from 'utils/globalConstants'
import request from 'utils/request'
import { GET_FRIENDS_REQUEST } from './constants'
import { getFriendsSuccess, getFriendsFail } from './actions'

export function* getFriendsRequestWatcher() {
  yield takeLatest(GET_FRIENDS_REQUEST, getFriendsRequestHandler)
}

export function* getFriendsRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/user/${payload}/friends`
  const params = { method: 'GET' }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getFriendsSuccess(res))
  } catch (err) {
    yield put(getFriendsFail(err.toString()))
  }
}

export default [getFriendsRequestWatcher]
