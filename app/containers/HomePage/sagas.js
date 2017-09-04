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
    { name: 'Amsterdam', x: 4.895168, y: 52.370216, zoom: 10.6 },
    { name: 'Antwerpen', x: 4.402464, y: 51.219448, zoom: 8.1 },
    { name: 'Brugge', x: 3.224700, y: 51.209348, zoom: 9.4 },
    { name: 'Rotterdam', x: 4.477733, y: 51.924420, zoom: 10.3 },
    { name: 'Den Haag', x: 4.300700, y: 52.070498, zoom: 10.3 },
    { name: 'Haarlem', x: 4.646219, y: 52.387388, zoom: 12.7 },
    { name: 'Delft', x: 4.357068, y: 52.011577, zoom: 8.3 },
    { name: 'Groningen', x: 6.566502, y: 53.219383, zoom: 8.2 },
    { name: 'Leiden', x: 4.497010, y: 52.160114, zoom: 10.2 },
    { name: 'Texel', x: 4.797715, y: 53.054763, zoom: 10.8 },
    { name: 'Maastricht', x: 5.690973, y: 50.851368, zoom: 12 },
    { name: 'Brabant', x: 5.232169, y: 51.482654, zoom: 12 },
    { name: 'Gelderland', x: 5.871824, y: 52.045155, zoom: 7.7 },
  ];

  try {
    questInfo = yield call(request, requestURL, params);

    const payload = {
      places: places,
      typesAll: 1,
      types: questInfo.types.map((type) => { return { name: type, visible: 0, active: 1 }; }),
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
