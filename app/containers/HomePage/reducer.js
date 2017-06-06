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
  TOGGLE_CATEGORY,
  FETCH_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_SUCCESS,
  FETCH_RECOMMENDATIONS_FAIL,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  username: '',
  properties: [
    {
      category: 'love',
      value: 0,
    },
    {
      category: 'drink',
      value: 0,
    },
    {
      category: 'painting',
      value: 0,
    },
    {
      category: 'history',
      value: 0,
    },
    {
      category: 'outdoor',
      value: 0,
    },
  ],
  recommendations: {
    fetching: false,
    error: null,
    details: [],
  },
});

function homeReducer(state = initialState, action) {
  let properties;
  let recommendations;
  let nextState;
  switch (action.type) {
    case TOGGLE_CATEGORY:
      properties = state.get('properties').map((property) => {
        if (property.get('category') === action.category) {
          return property.set('value', (property.get('value') === 1 ? 0 : 1));
        }
        return property;
      });
      nextState = state.set('properties', properties);
      return nextState;

    case FETCH_RECOMMENDATIONS:
      recommendations = {
        fetching: true,
        error: null,
        details: [],
      };

      nextState = state.setIn(['recommendations'], fromJS(recommendations));
      return nextState;

    case FETCH_RECOMMENDATIONS_SUCCESS:
      recommendations = {
        fetching: false,
        error: null,
        details: action.payload,
      };

      nextState = state.setIn(['recommendations'], fromJS(recommendations));
      return nextState;

    case FETCH_RECOMMENDATIONS_FAIL:
      recommendations = {
        fetching: false,
        error: true,
        details: [],
      };

      nextState = state.setIn(['recommendations'], fromJS(recommendations));
      return nextState;

    default:
      return state;
  }
}

export default homeReducer;
