import { take, call, put, select, cancel, takeLatest, actionChannel } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { findIndex } from 'lodash'
import { API_BASE_URL } from 'containers/App/constants'
import { selectCurrentTypes, selectCurrentDescriptives, selectViewport, selectTypes } from 'containers/QuestPage/selectors'
import { selectLocale } from 'containers/LanguageProvider/selectors'
import request from 'utils/request'
import { urlComposer } from 'utils/urlHelper'
import { GET_BROCHURE_REQUEST, GET_RECOMMENDATION_REQUEST, GET_QUESTINFO_REQUEST, DESCRIPTIVE_ANYTHING_CLICK } from './constants'
import {
  getRecommendationRequest,
  getRecommendationSuccess,
  getRecommendationFail,
  getQuestInfoSuccess,
  getQuestInfoFail,
  getBrochureSuccess,
  getBrochureFail,
  setDefaultQuest,
} from './actions'

export function* getRecommendationRequestHandler() {
  const viewport = yield select(selectViewport())
  const questTypes = yield select(selectTypes())
  const curTypes = yield select(selectCurrentTypes())
  const curDescriptives = yield select(selectCurrentDescriptives())
  const locale = yield select(selectLocale())

  const requestURL = `${API_BASE_URL}api/v1/map/recommendation/`

  let types = {
    all: curTypes.all,
    includes: [],
    excludes: [],
  }

  let descriptives = {
    all: curDescriptives.all,
    stars: [],
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

  for (let type of curDescriptives.stars) {
    descriptives.stars.push(type.c)
  }

  for (let type of curDescriptives.includes) {
    descriptives.includes.push(type.c)
  }

  for (let type of curDescriptives.excludes) {
    descriptives.excludes.push(type.c)
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

  const { sendRequest } = urlComposer(viewport, curTypes, curDescriptives, locale)

  let res = []
  try {
    if (sendRequest) { res = yield call(request, requestURL, params) }
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
    if (payload) {
      yield put(setDefaultQuest(payload))
      yield put(getRecommendationRequest())
    }
  } catch (err) {
    yield put(getQuestInfoFail(err.toString()))
  }
}

export function* getBrochureRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/map/place/`

  const data = {
    name: payload,
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

export function* getRecommendationWatcher() {
  const watcher = yield takeLatest(GET_RECOMMENDATION_REQUEST, getRecommendationRequestHandler)
}

export function* getQuestInfoWatcher() {
  const watcher = yield takeLatest(GET_QUESTINFO_REQUEST, getQuestInfoRequestHandler)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* getBrochureWatcher() {
  const watcher = yield takeLatest(GET_BROCHURE_REQUEST, getBrochureRequestHandler)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export default [
  getRecommendationWatcher,
  getQuestInfoWatcher,
  getBrochureWatcher,
]
