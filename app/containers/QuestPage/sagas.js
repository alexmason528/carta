/**
 * Gets the recommendations and locations
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import request from 'utils/request';
import { makeSelectCurrentTypes, makeSelectCurrentDescriptives, makeSelectViewport } from 'containers/QuestPage/selectors';

import { FETCH_BROCHURE, FETCH_RECOMMENDATIONS, FETCH_QUESTINFO, API_BASE_URL } from './constants';
import {
  fetchRecommendationsSuccess,
  fetchRecommendationsError,
  fetchQuestInfoSuccess,
  fetchQuestInfoError,
  fetchBrochureSuccess,
  fetchBrochureError,
} from './actions';

export function* getRecommendations() {
  const curDescriptives = yield select(makeSelectCurrentDescriptives());
  const curTypes = yield select(makeSelectCurrentTypes());
  const viewport = yield select(makeSelectViewport());

  const requestURL = `${API_BASE_URL}api/v1/map/recommendation/`;

  let types = {
    active: curTypes.active,
    inactive: curTypes.inactive,
  };

  let descriptives;

  if (curDescriptives.anything === 1) {
    descriptives = {
      stars: curDescriptives.star,
      interests: curDescriptives.inactive,
    };
  } else {
    descriptives = {
      stars: curDescriptives.star,
      interests: curDescriptives.active,
    };
  }

  const data = {
    count: 5,
    descriptivesAll: curDescriptives.anything,
    descriptives: descriptives,
    typesAll: curTypes.anything,
    types: types,
    viewport: viewport,
  };

  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let sendRequest = false;
  if ((data.typesAll === 1 || data.types.active.length > 0) && (data.descriptivesAll === 1 || data.descriptives.stars.length > 0 || data.descriptives.interests.length > 0)) {
    sendRequest = true;
  }

  let recommendations = [];

  try {
    if (sendRequest) {
      recommendations = yield call(request, requestURL, params);
    }

    yield put(fetchRecommendationsSuccess(recommendations));
  } catch (err) {
    yield put(fetchRecommendationsError(recommendations));
  }
}

export function* getQuestInfo() {
  const requestURL = `${API_BASE_URL}api/v1/map/questinfo/`;

  const params = {
    method: 'GET',
  };

  let questInfo;

  const places = [
    { name: 'Netherlands', x: 5.291266, y: 52.132633, zoom: 6.3 },
    { name: 'Amsterdam', x: 4.895168, y: 52.370216, zoom: 13 },
    { name: 'Rotterdam', x: 4.477733, y: 51.924420, zoom: 13 },
    { name: 'Den Haag', x: 4.300700, y: 52.070498, zoom: 13 },
    { name: 'Haarlem', x: 4.646219, y: 52.387388, zoom: 15 },
    { name: 'Delft', x: 4.357068, y: 52.011577, zoom: 15 },
    { name: 'Leiden', x: 4.497010, y: 52.160114, zoom: 15 },
    { name: 'Maastricht', x: 5.690973, y: 50.851368, zoom: 15 },
    { name: 'Brabant', x: 5.232169, y: 51.482654, zoom: 9 },
    { name: 'Utrecht (city)', x: 5.121420, y: 52.090737, zoom: 15 },
    { name: 'Groningen (city)', x: 6.572026205, y: 53.22174606, zoom: 15 },
    { name: 'Friesland', x: 5.84860417, y: 53.11035652, zoom: 9 },
    { name: 'Drenthe', x: 6.625179798, y: 52.86318343, zoom: 9 },
    { name: 'Noord-Holland', x: 4.872905565, y: 52.58246219, zoom: 9 },
    { name: 'Flevoland', x: 5.601028581, y: 52.52705193, zoom: 9 },
    { name: 'Overijssel', x: 6.451303939, y: 52.44486644, zoom: 9 },
    { name: 'Zeeland', x: 3.835448283, y: 51.45192738, zoom: 9 },
    { name: 'Limburg', x: 5.938272858, y: 51.21129105, zoom: 9 },
  ];

  try {
    questInfo = yield call(request, requestURL, params);

    const payload = {
      places: places,
      types: questInfo.types.map((type) => { return { c: type.c, name: type.name }; }),
      descriptives: questInfo.descriptives.map((descriptive) => { return { c: descriptive.c, name: descriptive.name }; }),
    };

    yield put(fetchQuestInfoSuccess(payload));
  } catch (err) {
    yield put(fetchQuestInfoError(questInfo));
  }
}

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

export function* getRecommendationsWatcher() {
  const watcher = yield takeLatest(FETCH_RECOMMENDATIONS, getRecommendations);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getQuestInfoWatcher() {
  const watcher = yield takeLatest(FETCH_QUESTINFO, getQuestInfo);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getBrochureInformationWatcher() {
  const watcher = yield takeLatest(FETCH_BROCHURE, getBrochureInformation);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  getRecommendationsWatcher,
  getQuestInfoWatcher,
  getBrochureInformationWatcher,
];
