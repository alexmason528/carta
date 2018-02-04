import { call, put, select, takeLatest } from 'redux-saga/effects'
import { findIndex, map, uniq } from 'lodash'
import geoViewport from 'scripts/geo-viewport'
import { API_BASE_URL, RECOMMENDATION_COUNT, TILE_SIZE } from 'utils/globalConstants'
import request from 'utils/request'
import { canSendRequest } from 'utils/urlHelper'
import { GET_DESCRIPTIVES_REQUEST, GET_RECOMMENDATION_REQUEST, GET_QUESTINFO_REQUEST, SET_QUEST } from './constants'
import {
  getRecommendationSuccess,
  getRecommendationFail,
  getQuestInfoSuccess,
  getQuestInfoFail,
  setQuest,
  updateExpand,
  getDescriptivesRequest,
  getDescriptivesSuccess,
  getDescriptivesFail,
} from './actions'
import { selectCurrentTypes, selectCurrentDescriptives, selectViewport, selectTypes, selectPanelState } from './selectors'

export function* getRecommendationWatcher() {
  yield takeLatest([GET_RECOMMENDATION_REQUEST, SET_QUEST], getRecommendationRequestHandler)
}

export function* getRecommendationRequestHandler() {
  const { center, zoom } = yield select(selectViewport())
  const questTypes = yield select(selectTypes())
  const curTypes = yield select(selectCurrentTypes())
  const curDescriptives = yield select(selectCurrentDescriptives())
  const panelState = yield select(selectPanelState())

  const requestURL = `${API_BASE_URL}api/v1/map/recommendations`

  let types = {
    all: curTypes.all,
    includes: [],
    excludes: [],
  }

  if (curTypes.all) {
    for (let type of questTypes) {
      if (findIndex(curTypes.excludes, type) === -1) {
        types.includes.push(type.t)
      } else {
        types.excludes.push(type.t)
      }
    }
  } else {
    for (let type of questTypes) {
      if (findIndex(curTypes.includes, type) === -1) {
        types.excludes.push(type.t)
      } else {
        types.includes.push(type.t)
      }
    }
  }

  if (types.includes.length !== 0) {
    types.excludes.pop('t1')
    if (findIndex(types.includes, 't1') === -1) {
      types.includes.push('t1')
    }
  }

  types.includes = uniq(types.includes)
  types.excludes = uniq(types.excludes)

  const descriptives = {
    all: curDescriptives.all,
    stars: uniq(map(curDescriptives.stars, 'd')),
    includes: uniq(map(curDescriptives.includes, 'd')),
    excludes: uniq(map(curDescriptives.excludes, 'd')),
  }

  const width = window.innerWidth
  const height = window.innerHeight

  const bounds = geoViewport.bounds({ lon: center.lng, lat: center.lat }, parseInt(zoom + 2, 10), [width, height], TILE_SIZE)

  const swLng = bounds[0] + 260 / width * (bounds[2] - bounds[0])

  const data = {
    count: RECOMMENDATION_COUNT,
    viewport: { bounds: { _sw: { lng: panelState === 'opened' ? swLng : bounds[0], lat: bounds[1] }, _ne: { lng: bounds[2], lat: bounds[3] } }, zoom },
    types,
    descriptives,
  }

  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }

  try {
    let res = []
    if (canSendRequest({ types })) {
      res = yield call(request, requestURL, params)
    }
    yield put(getRecommendationSuccess(res))
    yield put(getDescriptivesRequest())
  } catch (err) {
    yield put(getRecommendationFail(err.details))
  }
}

export function* getQuestInfoWatcher() {
  yield takeLatest(GET_QUESTINFO_REQUEST, getQuestInfoRequestHandler)
}

export function* getQuestInfoRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/map/questinfo`
  const params = { method: 'GET' }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getQuestInfoSuccess(res))
    yield put(setQuest(payload))
    yield put(updateExpand())
  } catch (err) {
    yield put(getQuestInfoFail(err.details))
  }
}

export function* getDescriptivesWatcher() {
  yield takeLatest(GET_DESCRIPTIVES_REQUEST, getDescriptivesRequestHandler)
}

export function* getDescriptivesRequestHandler() {
  const requestURL = `${API_BASE_URL}api/v1/map/descriptives`
  const curTypes = yield select(selectCurrentTypes())
  const questTypes = yield select(selectTypes())

  let types = {
    all: curTypes.all,
    includes: [],
    excludes: [],
  }

  if (curTypes.all) {
    for (let type of questTypes) {
      if (findIndex(curTypes.excludes, type) === -1) {
        types.includes.push(type.t)
      } else {
        types.excludes.push(type.t)
      }
    }
  } else {
    for (let type of questTypes) {
      if (findIndex(curTypes.includes, type) === -1) {
        types.excludes.push(type.t)
      } else {
        types.includes.push(type.t)
      }
    }
  }

  if (types.includes.length !== 0) {
    types.excludes.pop('t1')
    if (findIndex(types.includes, 't1') === -1) {
      types.includes.push('t1')
    }
  }

  types.includes = uniq(types.includes)
  types.excludes = uniq(types.excludes)

  if (!types.all && types.includes.length === 0) {
    types.includes = types.excludes
  }

  const data = { types }

  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getDescriptivesSuccess(res))
  } catch (err) {
    yield put(getDescriptivesFail(err.details))
  }
}

export default [getRecommendationWatcher, getQuestInfoWatcher, getDescriptivesWatcher]
