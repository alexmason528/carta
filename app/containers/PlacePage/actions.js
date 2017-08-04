/*
 * Place Actions
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
  FETCH_PLACE,
  FETCH_PLACE_SUCCESS,
  FETCH_PLACE_ERROR,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

export function fetchPlace(name) {
  return {
    type: FETCH_PLACE,
    name,
  };
}

export function fetchPlaceSuccess(payload) {
  return {
    type: FETCH_PLACE_SUCCESS,
    payload,
  };
}

export function fetchPlaceError(payload) {
  return {
    type: FETCH_PLACE_ERROR,
    payload,
  };
}

