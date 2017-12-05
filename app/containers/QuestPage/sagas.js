import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'

import request from 'utils/request'
import { API_BASE_URL } from 'containers/App/constants'
import { selectCurrentTypes, selectCurrentDescriptives, selectViewport } from 'containers/QuestPage/selectors'

import { GET_BROCHURE_REQUEST, GET_RECOMMENDATION_REQUEST, GET_QUESTINFO_REQUEST } from './constants'
import {
  getRecommendationSuccess,
  getRecommendationFail,
  getQuestInfoSuccess,
  getQuestInfoFail,
  getBrochureSuccess,
  getBrochureFail,
} from './actions'

export function* getRecommendationRequest() {
  const curDescriptives = yield select(selectCurrentDescriptives())
  const curTypes = yield select(selectCurrentTypes())
  const viewport = yield select(selectViewport())

  const requestURL = `${API_BASE_URL}api/v1/map/recommendation/`

  let types = {
    active: curTypes.active,
    inactive: curTypes.inactive,
  }

  let descriptives

  if (curDescriptives.anything) {
    descriptives = {
      stars: curDescriptives.star,
      interests: curDescriptives.inactive,
    }
  } else {
    descriptives = {
      stars: curDescriptives.star,
      interests: curDescriptives.active,
    }
  }

  const data = {
    count: 5,
    descriptivesAll: curDescriptives.anything,
    descriptives: descriptives,
    typesAll: curTypes.anything,
    types: types,
    viewport: viewport,
  }

  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  let sendRequest = false
  if ((data.typesAll || data.types.active.length > 0) && (data.descriptivesAll || data.descriptives.stars.length > 0 || data.descriptives.interests.length > 0)) {
    sendRequest = true
  }

  let res = []

  try {
    if (sendRequest) {
      res = yield call(request, requestURL, params)
    }

    yield put(getRecommendationSuccess(res))
  } catch (err) {
    yield put(getRecommendationFail(err.toString()))
  }
}

export function* getQuestInfoRequest() {
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
    const payload = {
      places,
      types,
      descriptives,
    }

    yield put(getQuestInfoSuccess(payload))
  } catch (err) {
    yield put(getQuestInfoFail(err.toString()))
  }
}

export function* getBrochureRequest({ payload }) {
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
  const watcher = yield takeLatest(GET_RECOMMENDATION_REQUEST, getRecommendationRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* getQuestInfoWatcher() {
  const watcher = yield takeLatest(GET_QUESTINFO_REQUEST, getQuestInfoRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* getBrochureWatcher() {
  const watcher = yield takeLatest(GET_BROCHURE_REQUEST, getBrochureRequest)
  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export default [
  getRecommendationWatcher,
  getQuestInfoWatcher,
  getBrochureWatcher,
]
