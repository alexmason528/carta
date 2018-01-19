import { call, put, takeLatest, select } from 'redux-saga/effects'
import { selectUser } from 'containers/App/selectors'
import { API_BASE_URL } from 'utils/globalConstants'
import { setItem } from 'utils/localStorage'
import request from 'utils/request'
import { GET_FRIENDS_REQUEST, UPDATE_HOLIDAY_PIC_REQUEST } from './constants'
import { getFriendsSuccess, getFriendsFail, updateHolidayPicSuccess, updateHolidayPicFail } from './actions'

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
    yield put(getFriendsFail(err.details))
  }
}

export function* updateHolidayPicRequestWatcher() {
  yield takeLatest(UPDATE_HOLIDAY_PIC_REQUEST, updateHolidayPicRequestHandler)
}

export function* updateHolidayPicRequestHandler({ payload }) {
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
    yield put(updateHolidayPicSuccess(res.holidayPic))
  } catch (err) {
    yield put(updateHolidayPicFail(err.details))
  }
}

export default [getFriendsRequestWatcher, updateHolidayPicRequestWatcher]
