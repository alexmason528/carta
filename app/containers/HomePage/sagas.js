/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import request from 'utils/request';
import { makeSelectProperties } from 'containers/HomePage/selectors';

import { FETCH_RECOMMENDATIONS } from './constants';
import { fetchRecommendationsSuccess, fetchRecommendationsError } from './actions';

import { toJS } from 'immutable';

export function* getRecommendations() {
  const properties = yield select(makeSelectProperties());
  const requestURL = `https://carta-168713.appspot.com/api/v1/map/getlocation/`;
  
  const data = {
    count: 5,
    properties: properties.toJS()
  }

  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const recommendations = yield call(request, requestURL, params);
    yield put(fetchRecommendationsSuccess(recommendations));
  } catch (err) {
    yield put(fetchRecommendationsError(recommendations));
  }
}

export function* getLocationData() {
  const watcher = yield takeLatest(FETCH_RECOMMENDATIONS, getRecommendations);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  getLocationData
];
