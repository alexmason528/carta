import {
  MAP_CHANGE,
  TYPE_SELECT,
  DESCRIPTIVE_SELECT,
  UPDATE_VISIBILITY,
  SET_DEFAULT_QUEST,

  QUEST_ADD,
  QUEST_SELECT,
  QUEST_REMOVE,

  GET_QUESTINFO_REQUEST,
  GET_QUESTINFO_SUCCESS,
  GET_QUESTINFO_FAIL,

  GET_RECOMMENDATION_REQUEST,
  GET_RECOMMENDATION_SUCCESS,
  GET_RECOMMENDATION_FAIL,

  GET_BROCHURE_REQUEST,
  GET_BROCHURE_SUCCESS,
  GET_BROCHURE_FAIL,
} from './constants'

export function mapChange(payload) {
  return {
    type: MAP_CHANGE,
    payload,
  }
}

export function typeSelect(payload) {
  return {
    type: TYPE_SELECT,
    payload,
  }
}

export function descriptiveSelect(payload) {
  return {
    type: DESCRIPTIVE_SELECT,
    payload,
  }
}

export function updateVisibility() {
  return {
    type: UPDATE_VISIBILITY,
  }
}

export function questAdd() {
  return {
    type: QUEST_ADD,
  }
}

export function questSelect(payload) {
  return {
    type: QUEST_SELECT,
    payload,
  }
}

export function questRemove(payload) {
  return {
    type: QUEST_REMOVE,
    payload,
  }
}

export function getQuestInfoRequest() {
  return {
    type: GET_QUESTINFO_REQUEST,
  }
}

export function getQuestInfoSuccess(payload) {
  return {
    type: GET_QUESTINFO_SUCCESS,
    payload,
  }
}

export function getQuestInfoFail(payload) {
  return {
    type: GET_QUESTINFO_FAIL,
    payload,
  }
}

export function getRecommendationRequest() {
  return {
    type: GET_RECOMMENDATION_REQUEST,
  }
}

export function getRecommendationSuccess(payload) {
  return {
    type: GET_RECOMMENDATION_SUCCESS,
    payload,
  }
}

export function getRecommendationFail(payload) {
  return {
    type: GET_RECOMMENDATION_FAIL,
    payload,
  }
}

export function getBrochureRequest(payload) {
  return {
    type: GET_BROCHURE_REQUEST,
    payload,
  }
}

export function getBrochureSuccess(payload) {
  return {
    type: GET_BROCHURE_SUCCESS,
    payload,
  }
}

export function getBrochureFail(payload) {
  return {
    type: GET_BROCHURE_FAIL,
    payload,
  }
}

export function setDefaultQuest(payload) {
  return {
    type: SET_DEFAULT_QUEST,
    payload,
  }
}
