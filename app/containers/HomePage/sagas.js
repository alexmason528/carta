/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import request from 'utils/request';
import { makeSelectCategories } from 'containers/HomePage/selectors';

import { FETCH_RECOMMENDATIONS, FETCH_CATEGORIES, API_BASE_URL } from './constants';
import { fetchRecommendationsSuccess, fetchRecommendationsError, fetchCategoriesSuccess, fetchCategoriesError } from './actions';

export function* getRecommendations() {
  const categories = yield select(makeSelectCategories());
  const requestURL = `${API_BASE_URL}api/v1/map/recommendation/`;

  const data = {
    count: 5,
    categories: categories.get('details').toJS(),
  };

  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let recommendations;

  try {
    recommendations = yield call(request, requestURL, params);
    yield put(fetchRecommendationsSuccess(recommendations));
  } catch (err) {
    yield put(fetchRecommendationsError(recommendations));
  }
}

export function* getRecommendationsWatcher() {
  const watcher = yield takeLatest(FETCH_RECOMMENDATIONS, getRecommendations);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}


export function* getCategories() {
  const requestURL = `${API_BASE_URL}api/v1/map/category/`;

  const params = {
    method: 'GET',
  };


  let categories;

  try {
    categories = yield call(request, requestURL, params);

    const payload = [];
    categories.forEach((category) => {
      payload.push({
        name: category,
        value: 0,
      });
    });

    yield put(fetchCategoriesSuccess(payload));
  } catch (err) {
    yield put(fetchCategoriesError(categories));
  }
}

export function* getCategoriesWatcher() {
  const watcher = yield takeLatest(FETCH_CATEGORIES, getCategories);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  getRecommendationsWatcher,
  getCategoriesWatcher,
];
