/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

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
  FETCH_QUESTINFO_ERROR,

  FETCH_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_SUCCESS,
  FETCH_RECOMMENDATIONS_ERROR,

  FETCH_BROCHURE,
  FETCH_BROCHURE_SUCCESS,
  FETCH_BROCHURE_ERROR,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

export function mapChange(payload) {
  return {
    type: MAP_CHANGE,
    payload,
  };
}

export function placeSelect(payload) {
  return {
    type: PLACE_SELECT,
    payload,
  };
}

export function typeSelect(payload) {
  return {
    type: TYPE_SELECT,
    payload,
  };
}

export function descriptiveSelect(payload) {
  return {
    type: DESCRIPTIVE_SELECT,
    payload,
  };
}

export function updateVisibility() {
  return {
    type: UPDATE_VISIBILITY,
  };
}

export function questAdd() {
  return {
    type: QUEST_ADD,
  };
}

export function questSelect(payload) {
  return {
    type: QUEST_SELECT,
    payload,
  };
}

export function questRemove(payload) {
  return {
    type: QUEST_REMOVE,
    payload,
  };
}

export function fetchQuestInfo() {
  return {
    type: FETCH_QUESTINFO,
  };
}

export function fetchQuestInfoSuccess(payload) {
  return {
    type: FETCH_QUESTINFO_SUCCESS,
    payload,
  };
}

export function fetchQuestInfoError(payload) {
  return {
    type: FETCH_QUESTINFO_ERROR,
    payload,
  };
}

export function fetchRecommendations() {
  return {
    type: FETCH_RECOMMENDATIONS,
  };
}

export function fetchRecommendationsSuccess(payload) {
  return {
    type: FETCH_RECOMMENDATIONS_SUCCESS,
    payload,
  };
}

export function fetchRecommendationsError(payload) {
  return {
    type: FETCH_RECOMMENDATIONS_ERROR,
    payload,
  };
}

export function fetchBrochure(name) {
  return {
    type: FETCH_BROCHURE,
    name,
  };
}

export function fetchBrochureSuccess(payload) {
  return {
    type: FETCH_BROCHURE_SUCCESS,
    payload,
  };
}

export function fetchBrochureError(payload) {
  return {
    type: FETCH_BROCHURE_ERROR,
    payload,
  };
}

export function setDefaultQuest(payload) {
  return {
    type: SET_DEFAULT_QUEST,
    payload,
  };
}
