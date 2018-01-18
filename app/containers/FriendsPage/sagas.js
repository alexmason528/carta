import { call, put, takeLatest, select } from 'redux-saga/effects'
import { API_BASE_URL } from 'containers/App/constants'
import request from 'utils/request'
import { selectUser } from 'containers/App/selectors'
import { GET_FRIENDS_REQUEST } from './constants'
import { getFriendsSuccess, getFriendsFail } from './actions'

export function* getFriendsRequestWatcher() {
  yield takeLatest(GET_FRIENDS_REQUEST, getFriendsRequestHandler)
}

export function* getFriendsRequestHandler() {
  const user = yield select(selectUser())
  const requestURL = `${API_BASE_URL}api/v1/user/${user._id}/friends`
  const params = { method: 'GET' }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getFriendsSuccess(res))
  } catch (err) {
    yield put(getFriendsFail(err.toString()))
  }
}

export default [getFriendsRequestWatcher]
