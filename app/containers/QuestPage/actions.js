import {
  TYPE_SEARCH_EXP_CHANGE,
  DESCRIPTIVE_SEARCH_EXP_CHANGE,
  UPDATE_EXPAND,
  SET_QUEST,
  SET_PANEL_STATE,
  GET_QUESTINFO_REQUEST,
  GET_QUESTINFO_SUCCESS,
  GET_QUESTINFO_FAIL,
  GET_RECOMMENDATION_REQUEST,
  GET_RECOMMENDATION_SUCCESS,
  GET_RECOMMENDATION_FAIL,
  GET_DESCRIPTIVES_REQUEST,
  GET_DESCRIPTIVES_SUCCESS,
  GET_DESCRIPTIVES_FAIL,
} from './constants'

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

export function setQuest(payload) {
  return {
    type: SET_QUEST,
    payload,
  }
}

export function setPanelState(payload) {
  return {
    type: SET_PANEL_STATE,
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
