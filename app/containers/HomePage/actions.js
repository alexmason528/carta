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
  TOGGLE_CATEGORY,
  ZOOM_CHANGE,
  PLACE_SELECT,
  FETCH_QUESTINFO,
  FETCH_QUESTINFO_SUCCESS,
  FETCH_QUESTINFO_ERROR,
  FETCH_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_SUCCESS,
  FETCH_RECOMMENDATIONS_ERROR,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

export function toggleCategory(name) {
  return {
    type: TOGGLE_CATEGORY,
    name,
  };
}
export function zoomChange(zoomlevel, viewport) {
  return {
    type: ZOOM_CHANGE,
    zoomlevel,
    viewport,
  };
}
export function placeSelect(name) {
  return {
    type: PLACE_SELECT,
    name,
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
