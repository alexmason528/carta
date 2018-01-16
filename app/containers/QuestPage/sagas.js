import { call, put, select, takeLatest } from 'redux-saga/effects'
import { findIndex, map } from 'lodash'
import { browserHistory } from 'react-router'
import { API_BASE_URL, RECOMMENDATION_COUNT } from 'containers/App/constants'
import {
  selectBrochureLink,
  selectCurrentTypes,
  selectCurrentDescriptives,
  selectViewport,
  selectTypes,
} from 'containers/QuestPage/selectors'
import request from 'utils/request'
import { canSendRequest, urlComposer } from 'utils/urlHelper'
import {
  GET_BROCHURE_INFO_REQUEST,
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
  CLEAR_BROCHURE,
} from './constants'
import {
  getRecommendationSuccess,
  getRecommendationFail,
  getQuestInfoSuccess,
  getQuestInfoFail,
  getBrochureInfoSuccess,
  getBrochureInfoFail,
  setQuest,
  updateExpand,
} from './actions'

export function* getRecommendationWatcher() {
  yield takeLatest(
    [GET_RECOMMENDATION_REQUEST, SET_QUEST],
    getRecommendationRequestHandler
  )
}

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

  const data = { count: RECOMMENDATION_COUNT, viewport, types, descriptives }

  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  let res = []
  try {
    if (canSendRequest({ types })) {
      res = yield call(request, requestURL, params)
    }
    yield put(getRecommendationSuccess(res))
  } catch (err) {
    yield put(getRecommendationFail(err.toString()))
  }
}

export function* getQuestInfoWatcher() {
  yield takeLatest(GET_QUESTINFO_REQUEST, getQuestInfoRequestHandler)
}

export function* getQuestInfoRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/map/questinfo/`

  const params = {
    method: 'GET',
  }

  const places = [
    { name: 'Netherlands', center: { lng: 5.2912, lat: 52.1326 }, zoom: 6.3 },
    { name: 'Amsterdam', center: { lng: 4.8951, lat: 52.3702 }, zoom: 13 },
    { name: 'Rotterdam', center: { lng: 4.4777, lat: 51.9244 }, zoom: 13 },
    { name: 'Den Haag', center: { lng: 4.3007, lat: 52.0704 }, zoom: 13 },
    { name: 'Haarlem', center: { lng: 4.6462, lat: 52.3873 }, zoom: 15 },
    { name: 'Delft', center: { lng: 4.357, lat: 52.0115 }, zoom: 15 },
    { name: 'Leiden', center: { lng: 4.497, lat: 52.1601 }, zoom: 15 },
    { name: 'Maastricht', center: { lng: 5.6909, lat: 50.8513 }, zoom: 15 },
    { name: 'Brabant', center: { lng: 5.2321, lat: 51.4826 }, zoom: 9 },
    { name: 'Utrecht (city)', center: { lng: 5.1214, lat: 52.0907 }, zoom: 15 },
    {
      name: 'Groningen (city)',
      center: { lng: 6.572, lat: 53.2217 },
      zoom: 15,
    },
    { name: 'Friesland', center: { lng: 5.8486, lat: 53.1103 }, zoom: 9 },
    { name: 'Drenthe', center: { lng: 6.6251, lat: 52.8631 }, zoom: 9 },
    { name: 'Noord-Holland', center: { lng: 4.8729, lat: 52.5824 }, zoom: 9 },
    { name: 'Flevoland', center: { lng: 5.601, lat: 52.527 }, zoom: 9 },
    { name: 'Overijssel', center: { lng: 6.4513, lat: 52.4448 }, zoom: 9 },
    { name: 'Zeeland', center: { lng: 3.8354, lat: 51.4519 }, zoom: 9 },
    { name: 'Limburg', center: { lng: 5.9382, lat: 51.2112 }, zoom: 9 },
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
    yield put(updateExpand())
  } catch (err) {
    yield put(getQuestInfoFail(err.toString()))
  }
}

export function* getBrochureInfoWatcher() {
  yield takeLatest(GET_BROCHURE_INFO_REQUEST, getBrochureInfoRequestHandler)
}

export function* getBrochureInfoRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/brochure/${payload}`

  const params = {
    method: 'GET',
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getBrochureInfoSuccess(res))
  } catch (err) {
    yield put(getBrochureInfoFail(err))
  }
}

export function* composeUrlWatcher() {
  yield takeLatest(
    [
      MAP_CHANGE,
      CLEAR_BROCHURE,
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

export function* composeUrl() {
  const viewport = yield select(selectViewport())
  const types = yield select(selectCurrentTypes())
  const descriptives = yield select(selectCurrentDescriptives())
  const brochureLink = yield select(selectBrochureLink())
  const url = urlComposer(
    Object.assign(
      {},
      { viewport, types, descriptives },
      brochureLink && { brochure: brochureLink }
    )
  )
  if (browserHistory.getCurrentLocation().pathname !== url) {
    yield call(browserHistory.push, url)
  }
}

export default [
  getRecommendationWatcher,
  getQuestInfoWatcher,
  getBrochureInfoWatcher,
  composeUrlWatcher,
]
