/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import request from 'utils/request';

import { FETCH_PLACE, API_BASE_URL } from './constants';
import { fetchPlaceSuccess, fetchPlaceError } from './actions';

export function* getPlaceInformation(payload) {
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

  let place;
  try {
    place = yield call(request, requestURL, params);
    yield put(fetchPlaceSuccess(place));
  } catch (err) {
    yield put(fetchPlaceError(place));
  }
}

export function* getPlaceInformationWatcher() {
  const watcher = yield takeLatest(FETCH_PLACE, getPlaceInformation);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  getPlaceInformationWatcher,
];
