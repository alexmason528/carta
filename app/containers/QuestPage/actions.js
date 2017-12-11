import {
  MAP_CHANGE,

  PLACE_CLICK,

  TYPE_CLICK,
  TYPE_ANYTHING_CLICK,

  DESCRIPTIVE_CLICK,
  DESCRIPTIVE_STAR_CLICK,
  DESCRIPTIVE_ANYTHING_CLICK,

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

export function placeClick(payload) {
  return {
    type: PLACE_CLICK,
    payload,
  }
}

export function typeClick(payload) {
  return {
    type: TYPE_CLICK,
    payload,
  }
}

export function typeAnythingClick(payload) {
  return {
    type: TYPE_ANYTHING_CLICK,
    payload,
  }
}

export function descriptiveClick(payload) {
  return {
    type: DESCRIPTIVE_CLICK,
    payload,
  }
}

export function descriptiveStarClick(payload) {
  return {
    type: DESCRIPTIVE_STAR_CLICK,
    payload,
  }
}

export function descriptiveAnythingClick(payload) {
  return {
    type: DESCRIPTIVE_ANYTHING_CLICK,
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

export function getQuestInfoRequest(payload) {
  return {
    type: GET_QUESTINFO_REQUEST,
    payload,
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
