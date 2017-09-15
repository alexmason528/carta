/**
 * Gets the brochure
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import request from 'utils/request';

import { FETCH_BROCHURE, API_BASE_URL } from './constants';
import { fetchBrochureSuccess, fetchBrochureError } from './actions';

export function* getBrochureInformation(payload) {
  const requestURL = `${API_BASE_URL}api/v1/map/place/`;

  const data = {
    name: payload.name,
  };

  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response;
  try {
    response = yield call(request, requestURL, params);
    yield put(fetchBrochureSuccess(response));
  } catch (err) {
    yield put(fetchBrochureError(response));
  }
}

export function* getBrochureInformationWatcher() {
  const watcher = yield takeLatest(FETCH_BROCHURE, getBrochureInformation);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  getBrochureInformationWatcher,
];
