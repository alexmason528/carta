import {
  MAP_CHANGE,
  TYPE_SEARCH_EXP_CHANGE,
  DESCRIPTIVE_SEARCH_EXP_CHANGE,
  UPDATE_EXPAND,
  PLACE_CLICK,
  TYPE_CLICK,
  TYPE_ANYTHING_CLICK,
  DESCRIPTIVE_CLICK,
  DESCRIPTIVE_STAR_CLICK,
  DESCRIPTIVE_ANYTHING_CLICK,
  SET_QUEST,
  QUEST_ADD,
  QUEST_SELECT,
  QUEST_REMOVE,
  GET_QUESTINFO_REQUEST,
  GET_QUESTINFO_SUCCESS,
  GET_QUESTINFO_FAIL,
  GET_RECOMMENDATION_REQUEST,
  GET_RECOMMENDATION_SUCCESS,
  GET_RECOMMENDATION_FAIL,
  GET_BROCHURE_INFO_REQUEST,
  GET_BROCHURE_INFO_SUCCESS,
  GET_BROCHURE_INFO_FAIL,
  GET_DESCRIPTIVES_REQUEST,
  GET_DESCRIPTIVES_SUCCESS,
  GET_DESCRIPTIVES_FAIL,
  CLEAR_BROCHURE,
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

export function getRecommendationRequest(payload) {
  return {
    type: GET_RECOMMENDATION_REQUEST,
    payload,
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

export function getBrochureInfoRequest(payload) {
  return {
    type: GET_BROCHURE_INFO_REQUEST,
    payload,
  }
}

export function getBrochureInfoSuccess(payload) {
  return {
    type: GET_BROCHURE_INFO_SUCCESS,
    payload,
  }
}

export function getBrochureInfoFail(payload) {
  return {
    type: GET_BROCHURE_INFO_FAIL,
    payload,
  }
}

export function setQuest(payload) {
  return {
    type: SET_QUEST,
    payload,
  }
}

export function typeSearchExpChange(payload) {
  return {
    type: TYPE_SEARCH_EXP_CHANGE,
    payload,
  }
}

export function descriptiveSearchExpChange(payload) {
  return {
    type: DESCRIPTIVE_SEARCH_EXP_CHANGE,
    payload,
  }
}

export function updateExpand() {
  return {
    type: UPDATE_EXPAND,
  }
}

export function getDescriptivesRequest() {
  return {
    type: GET_DESCRIPTIVES_REQUEST,
  }
}

export function getDescriptivesSuccess(payload) {
  return {
    type: GET_DESCRIPTIVES_SUCCESS,
    payload,
  }
}

export function getDescriptivesFail(payload) {
  return {
    type: GET_DESCRIPTIVES_FAIL,
    payload,
  }
}

export function clearBrochure() {
  return {
    type: CLEAR_BROCHURE,
  }
}
