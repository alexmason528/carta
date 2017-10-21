import {
  MAP_CHANGE,
  PLACE_SELECT,
  TYPE_SELECT,
  DESCRIPTIVE_SELECT,
  UPDATE_VISIBILITY,
  SET_DEFAULT_QUEST,

  QUEST_ADD,
  QUEST_SELECT,
  QUEST_REMOVE,

  FETCH_QUESTINFO,
  FETCH_QUESTINFO_SUCCESS,
  FETCH_QUESTINFO_FAIL,

  FETCH_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_SUCCESS,
  FETCH_RECOMMENDATIONS_FAIL,

  FETCH_BROCHURE,
  FETCH_BROCHURE_SUCCESS,
  FETCH_BROCHURE_FAIL,
} from './constants'

export function mapChange(payload) {
  return {
    type: MAP_CHANGE,
    payload,
  }
}

export function placeSelect(payload) {
  return {
    type: PLACE_SELECT,
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

export function fetchQuestInfo() {
  return {
    type: FETCH_QUESTINFO,
  }
}

export function fetchQuestInfoSuccess(payload) {
  return {
    type: FETCH_QUESTINFO_SUCCESS,
    payload,
  }
}

export function fetchQuestInfoFail(payload) {
  return {
    type: FETCH_QUESTINFO_FAIL,
    payload,
  }
}

export function fetchRecommendations() {
  return {
    type: FETCH_RECOMMENDATIONS,
  }
}

export function fetchRecommendationsSuccess(payload) {
  return {
    type: FETCH_RECOMMENDATIONS_SUCCESS,
    payload,
  }
}

export function fetchRecommendationsFail(payload) {
  return {
    type: FETCH_RECOMMENDATIONS_FAIL,
    payload,
  }
}

export function fetchBrochure(name) {
  return {
    type: FETCH_BROCHURE,
    name,
  }
}

export function fetchBrochureSuccess(payload) {
  return {
    type: FETCH_BROCHURE_SUCCESS,
    payload,
  }
}

export function fetchBrochureFail(payload) {
  return {
    type: FETCH_BROCHURE_FAIL,
    payload,
  }
}

export function setDefaultQuest(payload) {
  return {
    type: SET_DEFAULT_QUEST,
    payload,
  }
}
