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
  ZOOM_CHANGE,
  PLACE_SELECT,
  FETCH_QUESTINFO,
  FETCH_QUESTINFO_SUCCESS,
  FETCH_QUESTINFO_ERROR,
  FETCH_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_SUCCESS,
  FETCH_RECOMMENDATIONS_ERROR,
} from './constants';

// The initial state of the App

const initialState = fromJS({
  questInfo: {
    fetching: false,
    error: null,
    details: {
      places: [],
      types: [],
      descriptives: [],
    },
  },
  recommendations: {
    fetching: false,
    error: null,
    details: [],
  },
  zoomlevel: 7,
  viewport: {},
  currentPlace: {},
});


function homeReducer(state = initialState, action) {
  let questInfo;
  let recommendations;
  let details;
  let nextState;

  switch (action.type) {
    case TOGGLE_CATEGORY:
      details = state.get('questInfo').get('details').map((category) => {
        if (category.get('name') === action.name) {
          return category.set('value', (category.get('value') === 1 ? 0 : 1));
        }
        return category;
      });

      nextState = state.setIn(['questInfo', 'details'], details);

      return nextState;

    case ZOOM_CHANGE:
      const viewport = {
        northeast: {
          x: action.viewport._ne.lng,
          y: action.viewport._ne.lat,
        },
        southwest: {
          x: action.viewport._sw.lng,
          y: action.viewport._sw.lat,
        },
      };

      nextState = state.set('zoomlevel', action.zoomlevel).set('viewport', viewport);

      return nextState;

    case PLACE_SELECT:
      state.get('questInfo').get('details').get('places').map((place) => {
        if (place.get('name') === action.name) {
          nextState = state.set('currentPlace', place);
        }
      });

      return nextState;

    case FETCH_QUESTINFO:
      questInfo = {
        fetching: true,
        error: null,
        details: {
          places: [],
          types: [],
          descriptives: [],
        },
      };

      nextState = state.setIn(['questInfo'], fromJS(questInfo));
      return nextState;

    case FETCH_QUESTINFO_SUCCESS:
      questInfo = {
        fetching: false,
        error: null,
        details: action.payload,
      };

      nextState = state.setIn(['questInfo'], fromJS(questInfo)).set('currentPlace', fromJS(action.payload.places[0]));
      return nextState;

    case FETCH_QUESTINFO_ERROR:
      questInfo = {
        fetching: false,
        error: true,
        details: {
          places: [],
          types: [],
          descriptives: [],
        },
      };

      nextState = state.setIn(['questInfo'], fromJS(questInfo));
      return nextState;

    case FETCH_RECOMMENDATIONS:
      recommendations = state.get('recommendations').set({
        fetching: true,
        error: null,
      });

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

    case FETCH_RECOMMENDATIONS_ERROR:
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
