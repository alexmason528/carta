/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import request from 'utils/request';
import { makeSelectQuestInfo, makeSelectZoomLevel, makeSelectViewport } from 'containers/HomePage/selectors';

import { FETCH_RECOMMENDATIONS, FETCH_QUESTINFO, API_BASE_URL } from './constants';
import { fetchRecommendationsSuccess, fetchRecommendationsError, fetchQuestInfoSuccess, fetchQuestInfoError } from './actions';

// export function* getRecommendations() {
//   const storeQuestInfo = yield select(makeSelectQuestInfo());
//   const zoomlevel = yield select(makeSelectZoomLevel());
//   const viewport = yield select(makeSelectViewport());

//   const requestURL = `${API_BASE_URL}api/v1/map/recommendation/`;

//   let categories = [];

//   storeCategories.get('details').toJS().map((category) => {
//     if (category.value !== 0) categories.push(category.name);
//   });

//   const data = {
//     count: 5,
//     interests: categories,
//     zoomlevel: zoomlevel,
//     viewport: viewport,
//   };

//   const params = {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   let recommendations;

//   try {
//     recommendations = yield call(request, requestURL, params);
//     yield put(fetchRecommendationsSuccess(recommendations));
//   } catch (err) {
//     yield put(fetchRecommendationsError(recommendations));
//   }
// }

// export function* getRecommendationsWatcher() {
//   const watcher = yield takeLatest(FETCH_RECOMMENDATIONS, getRecommendations);
//   yield take(LOCATION_CHANGE);
//   yield cancel(watcher);
// }

export function* getQuestInfo() {
  const requestURL = `${API_BASE_URL}api/v1/map/questinfo/`;

  const params = {
    method: 'GET',
  };

  let questInfo;

  const places = [
    { name: 'Netherlands', x: 5.582313401, y: 52.26557456, zoom: 6.3 },
    { name: 'Amsterdam', x: 4.892450122, y: 52.37244399, zoom: 10.6 },
    { name: 'Antwerpen', x: 4.721043791, y: 51.23190072, zoom: 8.1 },
    { name: 'Brugge', x: 3.224712514, y: 51.19968549, zoom: 9.4 },
    { name: 'Rotterdam', x: 4.33717698, y: 51.92386034, zoom: 10.3 },
    { name: 'Haarlem', x: 4.649587087, y: 52.38320235, zoom: 12.7 },
    { name: 'Delft', x: 4.367830927, y: 51.99437121, zoom: 8.3 }, /* */
    { name: 'Groningen', x: 6.768463975, y: 53.21063636, zoom: 8.2 },
    { name: 'Leiden', x: 4.486764456, y: 52.15469817, zoom: 10.2 }, /* */
    { name: 'Texel', x: 4.804688548, y: 53.07835164, zoom: 10.8 },
    { name: 'Maastricht', x: 5.706453477, y: 50.85333479, zoom: 12 },
    { name: 'Gelderland', x: 5.946999631, y: 52.06117375, zoom: 7.7 },
  ];

  try {
    questInfo = yield call(request, requestURL, params);

    const payload = {
      places: places,
      types: questInfo.types.map((type) => { return { name: type, visible: 0, active: 1 }; }),
      descriptives: questInfo.descriptives.map((descriptive) => { return { name: descriptive, star: 0, visible: 0, active: 1 }; }),
    };

    yield put(fetchQuestInfoSuccess(payload));
  } catch (err) {
    yield put(fetchQuestInfoError(questInfo));
  }
}

export function* getQuestInfoWatcher() {
  const watcher = yield takeLatest(FETCH_QUESTINFO, getQuestInfo);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
//  getRecommendationsWatcher,
  getQuestInfoWatcher,
];
