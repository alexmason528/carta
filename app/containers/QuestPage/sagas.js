import { call, put, select, takeLatest } from 'redux-saga/effects'
import { findIndex, map } from 'lodash'
import { browserHistory } from 'react-router'
import { API_BASE_URL } from 'containers/App/constants'
import {
  selectCurrentTypes,
  selectCurrentDescriptives,
  selectViewport,
  selectTypes,
} from 'containers/QuestPage/selectors'
import request from 'utils/request'
import { canSendRequest, urlComposer } from 'utils/urlHelper'
import {
  GET_BROCHURE_REQUEST,
  GET_RECOMMENDATION_REQUEST,
  GET_QUESTINFO_REQUEST,
  MAP_CHANGE,
  PLACE_CLICK,
  TYPE_CLICK,
  TYPE_ANYTHING_CLICK,
  DESCRIPTIVE_CLICK,
  DESCRIPTIVE_STAR_CLICK,
  DESCRIPTIVE_ANYTHING_CLICK,
  QUEST_SELECT,
  SET_QUEST,
} from './constants'
import {
  getRecommendationSuccess,
  getRecommendationFail,
  getQuestInfoSuccess,
  getQuestInfoFail,
  getBrochureSuccess,
  getBrochureFail,
  setQuest,
} from './actions'

export function* getRecommendationRequestHandler() {
  const viewport = yield select(selectViewport())
  const questTypes = yield select(selectTypes())
  const curTypes = yield select(selectCurrentTypes())
  const curDescriptives = yield select(selectCurrentDescriptives())

  const requestURL = `${API_BASE_URL}api/v1/map/recommendation/`

  let types = {
    all: curTypes.all,
    includes: [],
    excludes: [],
  }

  if (curTypes.all) {
    for (let type of questTypes) {
      if (findIndex(curTypes.excludes, type) === -1) {
        types.includes.push(type.c)
      } else {
        types.excludes.push(type.c)
      }
    }
  } else {
    for (let type of questTypes) {
      if (findIndex(curTypes.includes, type) === -1) {
        types.excludes.push(type.c)
      } else {
        types.includes.push(type.c)
      }
    }
  }

  if (types.includes.length !== 0) {
    types.excludes.pop('c129')
    if (findIndex(types.includes, 'c129') === -1) {
      types.includes.push('c129')
    }
  }

  let descriptives = {
    all: curDescriptives.all,
    stars: map(curDescriptives.stars, 'c'),
    includes: map(curDescriptives.includes, 'c'),
    excludes: map(curDescriptives.excludes, 'c'),
  }

  const data = {
    count: 5,
    viewport,
    types,
    descriptives,
  }

  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  let res = []
  try {
    if (canSendRequest({ types, descriptives })) {
      res = yield call(request, requestURL, params)
    } else {
      res = []
    }
    yield put(getRecommendationSuccess(res))
  } catch (err) {
    yield put(getRecommendationFail(err.toString()))
  }
}

export function* getQuestInfoRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/map/questinfo/`

  const params = {
    method: 'GET',
  }

  const places = [
    { name: 'Netherlands', x: 5.2912, y: 52.1326, zoom: 6.3 },
    { name: 'Amsterdam', x: 4.8951, y: 52.3702, zoom: 13 },
    { name: 'Rotterdam', x: 4.4777, y: 51.9244, zoom: 13 },
    { name: 'Den Haag', x: 4.3007, y: 52.0704, zoom: 13 },
    { name: 'Haarlem', x: 4.6462, y: 52.3873, zoom: 15 },
    { name: 'Delft', x: 4.357, y: 52.0115, zoom: 15 },
    { name: 'Leiden', x: 4.497, y: 52.1601, zoom: 15 },
    { name: 'Maastricht', x: 5.6909, y: 50.8513, zoom: 15 },
    { name: 'Brabant', x: 5.2321, y: 51.4826, zoom: 9 },
    { name: 'Utrecht (city)', x: 5.1214, y: 52.0907, zoom: 15 },
    { name: 'Groningen (city)', x: 6.572, y: 53.2217, zoom: 15 },
    { name: 'Friesland', x: 5.8486, y: 53.1103, zoom: 9 },
    { name: 'Drenthe', x: 6.6251, y: 52.8631, zoom: 9 },
    { name: 'Noord-Holland', x: 4.8729, y: 52.5824, zoom: 9 },
    { name: 'Flevoland', x: 5.601, y: 52.527, zoom: 9 },
    { name: 'Overijssel', x: 6.4513, y: 52.4448, zoom: 9 },
    { name: 'Zeeland', x: 3.8354, y: 51.4519, zoom: 9 },
    { name: 'Limburg', x: 5.9382, y: 51.2112, zoom: 9 },
  ]

  try {
    const res = yield call(request, requestURL, params)
    const { types, descriptives } = res

    const questData = {
      places,
      types,
      descriptives,
    }

    yield put(getQuestInfoSuccess(questData))
    yield put(setQuest(payload))
  } catch (err) {
    yield put(getQuestInfoFail(err.toString()))
  }
}

export function* getBrochureRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/map/brochure/`

  const data = {
    link: payload,
  }

  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getBrochureSuccess(res.info))
  } catch (err) {
    yield put(getBrochureFail(err.toString()))
  }
}

export function* composeUrl() {
  const viewport = yield select(selectViewport())
  const types = yield select(selectCurrentTypes())
  const descriptives = yield select(selectCurrentDescriptives())
  const url = urlComposer({ viewport, types, descriptives })
  yield call(browserHistory.push, url)
}

export function* getRecommendationWatcher() {
  yield takeLatest(
    [GET_RECOMMENDATION_REQUEST, SET_QUEST],
    getRecommendationRequestHandler
  )
}

export function* getQuestInfoWatcher() {
  yield takeLatest(GET_QUESTINFO_REQUEST, getQuestInfoRequestHandler)
}

export function* getBrochureWatcher() {
  yield takeLatest(GET_BROCHURE_REQUEST, getBrochureRequestHandler)
}

export function* composeUrlWatcher() {
  yield takeLatest(
    [
      MAP_CHANGE,
      PLACE_CLICK,
      QUEST_SELECT,
      TYPE_CLICK,
      TYPE_ANYTHING_CLICK,
      DESCRIPTIVE_CLICK,
      DESCRIPTIVE_STAR_CLICK,
      DESCRIPTIVE_ANYTHING_CLICK,
    ],
    composeUrl
  )
}

export default [
  getRecommendationWatcher,
  getQuestInfoWatcher,
  getBrochureWatcher,
  composeUrlWatcher,
]
