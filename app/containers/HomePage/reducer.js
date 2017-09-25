/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import {
  FETCH_BROCHURE,
  FETCH_BROCHURE_SUCCESS,
  FETCH_BROCHURE_ERROR,
} from './constants';

// The initial state of the App

const initialState = fromJS({
  brochure: {
    fetching: false,
    error: null,
    details: {},
  },
});


function homeReducer(state = initialState, action) {
  let brochure;

  switch (action.type) {
    case FETCH_BROCHURE:
      brochure = {
        fetching: true,
        error: null,
        details: {},
      };

      return state.set('brochure', fromJS(brochure));

    case FETCH_BROCHURE_SUCCESS:
      brochure = {
        fetching: false,
        error: null,
        details: action.payload,
      };

      return state.set('brochure', fromJS(brochure));

    case FETCH_BROCHURE_ERROR:
      brochure = {
        fetching: false,
        error: action.payload,
        details: {},
      };

      return state.set('brochure', fromJS(brochure));

    default:
      return state;
  }
}

export default homeReducer;
