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
  ZOOM_CHANGE,
  PLACE_SELECT,
  TYPE_SELECT,
  DESCRIPTIVE_SELECT,
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

    case TYPE_SELECT:
      if (action.name === 'anything') {
        const types = state.get('questInfo').get('details').get('types').map((type) => {
          return type.set('active', action.active);
        });

        nextState = state.setIn(['questInfo', 'details', 'types'], types);
      } else {
        const types = state.get('questInfo').get('details').get('types').map((type) => {
          if (type.get('name') === action.name) {
            return type.set('active', action.active).set('visible', action.visible);
          }
          return type;
        });

        nextState = state.setIn(['questInfo', 'details', 'types'], types);
      }

      return nextState;

    case DESCRIPTIVE_SELECT:
      if (action.name === 'anything') {
        const descriptives = state.get('questInfo').get('details').get('descriptives').map((descriptive) => {
          return descriptive.set('active', action.active);
        });

        nextState = state.setIn(['questInfo', 'details', 'descriptives'], descriptives);
      } else {
        const descriptives = state.get('questInfo').get('details').get('descriptives').map((descriptive) => {
          if (descriptive.get('name') === action.name) {
            return descriptive.set('active', action.active).set('visible', action.visible).set('star', action.star);
          }
          return descriptive;
        });

        nextState = state.setIn(['questInfo', 'details', 'descriptives'], descriptives);
      }

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
