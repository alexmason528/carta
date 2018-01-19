import { call, put, takeLatest } from 'redux-saga/effects'
import { API_BASE_URL } from 'utils/globalConstants'
import request from 'utils/request'
import { GET_THEMES_REQUEST } from './constants'
import { getThemesSuccess, getThemesFail } from './actions'

export function* getThemesRequestWatcher() {
  yield takeLatest(GET_THEMES_REQUEST, getThemesRequestHandler)
}

export function* getThemesRequestHandler() {
  const requestURL = `${API_BASE_URL}api/v1/theme/`

  const params = {
    method: 'GET',
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getThemesSuccess(res))
  } catch (err) {
    yield put(getThemesFail(err.details))
  }
}

export default [getThemesRequestWatcher]
