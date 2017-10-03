/**
 * Gets the recommendations and locations
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import request from 'utils/request';

import { FETCH_COMMUNITYINFO, API_BASE_URL } from './constants';
import {
  fetchCommunityInfoSuccess,
  fetchCommunityInfoError,
} from './actions';

export function* getCommunityInfo() {
  const requestURL = `${API_BASE_URL}api/v1/community/info`;

  const params = {
    method: 'GET',
  };

  let response;
  try {
    response = yield call(request, requestURL, params);
    yield put(fetchCommunityInfoSuccess(response));
  } catch (err) {
    yield put(fetchCommunityInfoError(response));
  }
}

export function* getCommunityInfoWatcher() {
  const watcher = yield takeLatest(FETCH_COMMUNITYINFO, getCommunityInfo);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  getCommunityInfoWatcher,
];

