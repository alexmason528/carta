/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import request from 'utils/request';
import { makeSelectQuestInfo, makeSelectZoomLevel, makeSelectViewport } from 'containers/HomePage/selectors';

import { FETCH_RECOMMENDATIONS, FETCH_QUESTINFO, API_BASE_URL } from './constants';
import { fetchRecommendationsSuccess, fetchRecommendationsError, fetchQuestInfoSuccess, fetchQuestInfoError } from './actions';

export function* getRecommendations() {
  const questInfo = yield select(makeSelectQuestInfo());
  const zoomlevel = yield select(makeSelectZoomLevel());
  const viewport = yield select(makeSelectViewport());

  const requestURL = `${API_BASE_URL}api/v1/map/recommendation/`;

  const currentQuestIndex = questInfo.get('details').get('currentQuestIndex');
  const currentQuest = questInfo.get('details').get('quests').get(currentQuestIndex);

  let descriptives;

  const typesAll = currentQuest.get('typesAll');
  const descriptivesAll = currentQuest.get('descriptivesAll');

  let activeTypes = [];
  let inactiveTypes = [];

  currentQuest.get('types').map((type) => {
    if (type.get('active') === 1) {
      activeTypes.push(type.get('name'));
    } else {
      inactiveTypes.push(type.get('name'));
    }
  });

  let types = {
    active: activeTypes,
    inactive: inactiveTypes,
  };

  if (currentQuest.get('descriptivesAll') === 1) {
    let stars = [];
    let excludes = [];

    currentQuest.get('descriptives').map((descriptive) => {
      if (descriptive.get('star') === 1) {
        stars.push(descriptive.get('name'));
      } else if (descriptive.get('active') === 0) {
        excludes.push(descriptive.get('name'));
      }
    });

    descriptives = {
      stars: stars,
      interests: excludes,
    };
  } else {
    let stars = [];
    let includes = [];

    currentQuest.get('descriptives').map((descriptive) => {
      if (descriptive.get('star') === 1) {
        stars.push(descriptive.get('name'));
      } else if (descriptive.get('active') === 1) {
        includes.push(descriptive.get('name'));
      }
    });

    descriptives = {
      stars: stars,
      interests: includes,
    };
  }

  const data = {
    count: 5,
    descriptivesAll: descriptivesAll,
    descriptives: descriptives,
    typesAll: typesAll,
    types: types,
    zoomlevel: zoomlevel,
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
  if ((typesAll === 1 || types.active.length > 0) && (descriptivesAll === 1 || descriptives.stars.length > 0 || descriptives.interests.length > 0)) {
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
      typesAll: 0,
      types: questInfo.types.map((type) => { return { name: type, visible: 0, active: 0 }; }),
      descriptivesAll: 0,
      descriptives: questInfo.descriptives.map((descriptive) => { return { name: descriptive, star: 0, visible: 0, active: 0 }; }),
    };

    yield put(fetchQuestInfoSuccess(payload));
  } catch (err) {
    yield put(fetchQuestInfoError(questInfo));
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

// Bootstrap sagas
export default [
  getRecommendationsWatcher,
  getQuestInfoWatcher,
];
