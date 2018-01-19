import { call, put, select, takeLatest } from 'redux-saga/effects'
import { findIndex, map, uniq } from 'lodash'
import { browserHistory } from 'react-router'
import { selectBrochureLink, selectCurrentTypes, selectCurrentDescriptives, selectViewport, selectTypes } from 'containers/QuestPage/selectors'
import { API_BASE_URL, RECOMMENDATION_COUNT } from 'utils/globalConstants'
import request from 'utils/request'
import { canSendRequest, urlComposer } from 'utils/urlHelper'
import {
  GET_BROCHURE_INFO_REQUEST,
  GET_DESCRIPTIVES_REQUEST,
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
  getBrochureInfoSuccess,
  getBrochureInfoFail,
  setQuest,
  updateExpand,
  getDescriptivesRequest,
  getDescriptivesSuccess,
  getDescriptivesFail,
} from './actions'

export function* getRecommendationWatcher() {
  yield takeLatest([GET_RECOMMENDATION_REQUEST, SET_QUEST], getRecommendationRequestHandler)
}

export function* getRecommendationRequestHandler() {
  const viewport = yield select(selectViewport())
  const questTypes = yield select(selectTypes())
  const curTypes = yield select(selectCurrentTypes())
  const curDescriptives = yield select(selectCurrentDescriptives())

  const requestURL = `${API_BASE_URL}api/v1/map/recommendations/`

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

  let descriptives = {
    all: curDescriptives.all,
    stars: map(curDescriptives.stars, 'd'),
    includes: map(curDescriptives.includes, 'd'),
    excludes: map(curDescriptives.excludes, 'd'),
  }

  descriptives.stars = uniq(descriptives.stars)
  descriptives.includes = uniq(descriptives.includes)
  descriptives.excludes = uniq(descriptives.excludes)

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
    yield put(getDescriptivesRequest())
  } catch (err) {
    yield put(getRecommendationFail(err.toString()))
  }
}

export function* getQuestInfoWatcher() {
  yield takeLatest(GET_QUESTINFO_REQUEST, getQuestInfoRequestHandler)
}

export function* getQuestInfoRequestHandler({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/map/questinfo`

  const params = {
    method: 'GET',
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getQuestInfoSuccess(res))
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
    [MAP_CHANGE, PLACE_CLICK, QUEST_SELECT, TYPE_CLICK, TYPE_ANYTHING_CLICK, DESCRIPTIVE_CLICK, DESCRIPTIVE_STAR_CLICK, DESCRIPTIVE_ANYTHING_CLICK],
    composeUrl
  )
}

export function* composeUrl() {
  const viewport = yield select(selectViewport())
  const types = yield select(selectCurrentTypes())
  const descriptives = yield select(selectCurrentDescriptives())
  const brochureLink = yield select(selectBrochureLink())
  const url = urlComposer(Object.assign({}, { viewport, types, descriptives }, brochureLink && { brochure: brochureLink }))
  if (browserHistory.getCurrentLocation().pathname !== url) {
    yield call(browserHistory.push, url)
  }
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
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(getDescriptivesSuccess(res))
  } catch (err) {
    yield put(getDescriptivesFail(err.toString()))
  }
}

export function* getDescriptivesRequestWatcher() {
  yield takeLatest([GET_DESCRIPTIVES_REQUEST, TYPE_CLICK, TYPE_ANYTHING_CLICK], getDescriptivesRequestHandler)
}

export default [getRecommendationWatcher, getQuestInfoWatcher, getBrochureInfoWatcher, composeUrlWatcher, getDescriptivesRequestWatcher]
