/*
 * PlaceReducer
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
  FETCH_PLACE,
  FETCH_PLACE_SUCCESS,
  FETCH_PLACE_ERROR,
} from './constants';

// The initial state of the App

const initialState = fromJS({
  place: {
    fetching: false,
    error: null,
    details: {},
  },
});


function PlaceReducer(state = initialState, action) {
  let place;
  let nextState;

  switch (action.type) {
    case FETCH_PLACE:
      place = {
        fetching: true,
        error: null,
        details: {},
      };

      nextState = state.setIn(['place'], fromJS(place));
      return nextState;

    case FETCH_PLACE_SUCCESS:
      place = {
        fetching: false,
        error: null,
        details: action.payload,
      };

      nextState = state.setIn(['place'], fromJS(place));
      return nextState;

    case FETCH_PLACE_ERROR:
      place = {
        fetching: false,
        error: true,
        details: {},
      };

      nextState = state.setIn(['place'], fromJS(place));
      return nextState;

    default:
      return state;
  }
}

export default PlaceReducer;
