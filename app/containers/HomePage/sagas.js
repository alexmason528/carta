/**
 * Gets the recommendations and locations
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import request from 'utils/request';

import { FETCH_COMMUNITYINFO_REQUEST, LOGIN_REQUEST, API_BASE_URL } from './constants';
import {
  fetchCommunityInfoSuccess,
  fetchCommunityInfoError,
  loginSuccess,
  loginError,
} from './actions';

import { setItem, getItem, removeItem } from '../../utils/localStorage';

export function* getCommunityInfoRequest() {
  const requestURL = `${API_BASE_URL}api/v1/community/info`;

  const params = {
    method: 'GET',
  };

  try {
    const res = yield call(request, requestURL, params);
    yield put(fetchCommunityInfoSuccess(res));
  } catch (err) {
    yield put(fetchCommunityInfoError(err));
  }
}

export function* getCommunityInfoRequestWatcher() {
  const watcher = yield takeLatest(FETCH_COMMUNITYINFO_REQUEST, getCommunityInfoRequest);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loginRequest(action) {
  const requestURL = `${API_BASE_URL}api/v1/auth/login`;

  const params = {
    method: 'POST',
    body: JSON.stringify(action.payload),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = yield call(request, requestURL, params);
    yield call(setItem, 'auth', JSON.stringify(res));
    yield put(loginSuccess(res));
  } catch (err) {
    yield put(loginError(err.details));
  }
}

export function* loginRequestWatcher() {
  const watcher = yield takeLatest(LOGIN_REQUEST, loginRequest);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  getCommunityInfoRequestWatcher,
  loginRequestWatcher,
];
