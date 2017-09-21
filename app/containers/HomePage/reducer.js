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

// The initial state of the App

const initialState = fromJS({
  questInfo: {
    fetching: false,
    error: null,
    categories: {
      places: [],
      types: [],
      descriptives: [],
    },
    quests: [{
      viewport: {
        x: 0,
        y: 0,
        zoomlevel: 0,
      },
      types: {
        anything: 0,
        active: [],
        inactive: [],
      },
      descriptives: {
        anything: 0,
        star: [],
        active: [],
        inactive: [],
      },
    }],
    currentQuestIndex: 0,
  },
  recommendations: {
    fetching: false,
    error: null,
    details: [],
  },

  viewport: {
    zoom: 7,
    northeast: {},
    southwest: {},
  },

  brochure: {
    fetching: false,
    error: null,
    details: {},
  },
});


function homeReducer(state = initialState, action) {
  let questInfo;
  let recommendations;
  let currentQuestIndex;
  let types;
  let descriptives;
  let quests;
  let brochure;

  switch (action.type) {

    case MAP_CHANGE:
      const viewport = {
        zoom: action.payload.zoom,
        northeast: {
          x: action.payload.bounds._ne.lng,
          y: action.payload.bounds._ne.lat,
        },
        southwest: {
          x: action.payload.bounds._sw.lng,
          y: action.payload.bounds._sw.lat,
        },
      };

      return state.set('viewport', viewport);

    case PLACE_SELECT:
      currentQuestIndex = state.getIn(['questInfo', 'currentQuestIndex']);
      quests = state.getIn(['questInfo', 'quests']).toJS();

      quests[currentQuestIndex].place = action.payload;

      return state.setIn(['questInfo', 'quests'], fromJS(quests));

    case TYPE_SELECT:
      currentQuestIndex = state.getIn(['questInfo', 'currentQuestIndex']);
      quests = state.getIn(['questInfo', 'quests']).toJS();

      quests[currentQuestIndex].types = action.payload;

      return state.setIn(['questInfo', 'quests'], fromJS(quests));

    case DESCRIPTIVE_SELECT:
      currentQuestIndex = state.getIn(['questInfo', 'currentQuestIndex']);
      quests = state.getIn(['questInfo', 'quests']).toJS();

      quests[currentQuestIndex].descriptives = action.payload;

      return state.setIn(['questInfo', 'quests'], fromJS(quests));

    case UPDATE_VISIBILITY:
      currentQuestIndex = state.get('questInfo').get('details').get('currentQuestIndex');
      descriptives = state.get('questInfo').get('details').get('quests').get(currentQuestIndex).get('descriptives').map((descriptive) => {
        if (descriptive.get('active') === 0) return descriptive.set('visible', 0);
        return descriptive;
      });

      types = state.get('questInfo').get('details').get('quests').get(currentQuestIndex).get('types').map((type) => {
        if (type.get('active') === 0) return type.set('visible', 0);
        return type;
      });

      return state.setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'descriptives'], descriptives)
                       .setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'types'], types);

    case QUEST_ADD:
      const defaultQuest = {
        viewport: {
          x: 0,
          y: 0,
          zoomlevel: 0,
        },
        types: {
          anything: 0,
          active: [],
          inactive: [],
        },
        descriptives: {
          anything: 0,
          star: [],
          active: [],
          inactive: [],
        },
      };

      return state.setIn(['questInfo', 'quests'], state.getIn(['questInfo', 'quests']).push(defaultQuest));

    case QUEST_SELECT:
      return state.setIn(['questInfo', 'currentQuestIndex'], action.payload);

    case QUEST_REMOVE:
      currentQuestIndex = state.getIn(['questInfo', 'currentQuestIndex']);

      return (action.payload < currentQuestIndex)
        ? state.deleteIn(['questInfo', 'quests', action.payload]).setIn(['questInfo', 'currentQuestIndex'], currentQuestIndex - 1)
        : state.deleteIn(['questInfo', 'quests', action.payload]);

    case SET_DEFAULT_QUEST:
      return state;

    case FETCH_QUESTINFO:
      questInfo = {
        fetching: true,
        error: null,
        categories: {
          places: [],
          types: [],
          descriptives: [],
        },
        quests: initialState.getIn(['questInfo', 'quests']).toJS(),
        currentQuestIndex: 0,
      };

      return state.set('questInfo', fromJS(questInfo));

    case FETCH_QUESTINFO_SUCCESS:
      questInfo = {
        fetching: false,
        error: null,
        categories: action.payload,
        quests: initialState.getIn(['questInfo', 'quests']).toJS(),
        currentQuestIndex: 0,
      };

      return state.set('questInfo', fromJS(questInfo));

    case FETCH_QUESTINFO_ERROR:
      questInfo = {
        fetching: false,
        error: action.payload,
        categories: {
          places: [],
          types: [],
          descriptives: [],
        },
        quests: initialState.getIn(['questInfo', 'quests']).toJS(),
        currentQuestIndex: 0,
      };

      return state.set('questInfo', fromJS(questInfo));

    case FETCH_RECOMMENDATIONS:
      recommendations = state.get('recommendations').set({
        fetching: true,
        error: null,
      });

      return state.set('recommendations', fromJS(recommendations));

    case FETCH_RECOMMENDATIONS_SUCCESS:
      recommendations = {
        fetching: false,
        error: null,
        details: action.payload,
      };

      return state.set('recommendations', fromJS(recommendations));

    case FETCH_RECOMMENDATIONS_ERROR:
      recommendations = {
        fetching: false,
        error: action.payload,
        details: [],
      };

      return state.set('recommendations', fromJS(recommendations));

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
