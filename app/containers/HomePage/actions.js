/*
 * QuestPage Actions
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
  FETCH_COMMUNITYINFO_REQUEST,
  FETCH_COMMUNITYINFO_SUCCESS,
  FETCH_COMMUNITYINFO_ERROR,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

export function fetchCommunityInfoRequest() {
  return {
    type: FETCH_COMMUNITYINFO_REQUEST,
  };
}

export function fetchCommunityInfoSuccess(payload) {
  return {
    type: FETCH_COMMUNITYINFO_SUCCESS,
    payload,
  };
}

export function fetchCommunityInfoError(payload) {
  return {
    type: FETCH_COMMUNITYINFO_ERROR,
    payload,
  };
}

export function loginRequest(payload) {
  return {
    type: LOGIN_REQUEST,
    payload,
  };
}

export function loginSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload,
  };
}

export function loginError(payload) {
  return {
    type: LOGIN_ERROR,
    payload,
  };
}

export function register(payload) {
  return {
    type: REGISTER,
    payload,
  };
}

export function registerSuccess(payload) {
  return {
    type: REGISTER_SUCCESS,
    payload,
  };
}

export function registerError(payload) {
  return {
    type: REGISTER_ERROR,
    payload,
  };
}
