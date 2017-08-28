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
  QUEST_ADD,
  QUEST_SELECT,
  QUEST_REMOVE,
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
      defaultQuest: {
        places: [],
        types: [],
        descriptives: [],
        currentPlace: null,
      },
      quests: [
      ],
      currentQuestIndex: 0,
    },
  },
  recommendations: {
    fetching: false,
    error: null,
    details: [],
  },
  zoomlevel: 7,
  viewport: {},
});


function homeReducer(state = initialState, action) {
  let questInfo;
  let recommendations;
  let details;
  let nextState;
  let currentQuestIndex;
  let types;
  let descriptives;

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
      currentQuestIndex = state.get('questInfo').get('details').get('currentQuestIndex');
      let currentPlace;

      state.get('questInfo').get('details').get('quests').get(currentQuestIndex).get('places').map((place) => {
        if (place.get('name') === action.name) {
          currentPlace = place;
        }
      });

      nextState = state.setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'currentPlace'], currentPlace);
      return nextState;

    case TYPE_SELECT:
      currentQuestIndex = state.get('questInfo').get('details').get('currentQuestIndex');

      if (action.name === 'anything') {
        types = state.get('questInfo').get('details').get('quests').get(currentQuestIndex).get('types').map((type) => {
          return type.set('active', action.active);
        });
      } else {
        types = state.get('questInfo').get('details').get('quests').get(currentQuestIndex).get('types').map((type) => {
          if (type.get('name') === action.name) {
            return type.set('active', action.active).set('visible', action.visible);
          }
          return type;
        });
      }

      nextState = state.setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'types'], types);
      return nextState;

    case DESCRIPTIVE_SELECT:
      currentQuestIndex = state.get('questInfo').get('details').get('currentQuestIndex');

      if (action.name === 'anything') {
        descriptives = state.get('questInfo').get('details').get('quests').get(currentQuestIndex).get('descriptives').map((descriptive) => {
          return descriptive.set('active', action.active);
        });
      } else {
        descriptives = state.get('questInfo').get('details').get('quests').get(currentQuestIndex).get('descriptives').map((descriptive) => {
          if (descriptive.get('name') === action.name) {
            return descriptive.set('active', action.active).set('visible', action.visible).set('star', action.star);
          }
          return descriptive;
        });
      }

      nextState = state.setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'descriptives'], descriptives);
      return nextState;

    case QUEST_ADD:
      const defaultQuest = state.get('questInfo').get('details').get('defaultQuest');
      const newQuests = state.get('questInfo').get('details').get('quests').push(defaultQuest);

      nextState = state.setIn(['questInfo', 'details', 'quests'], newQuests);

      return nextState;

    case QUEST_SELECT:
      nextState = state.setIn(['questInfo', 'details', 'currentQuestIndex'], action.index);
      return nextState;

    case QUEST_REMOVE:
      currentQuestIndex = state.get('questInfo').get('details').get('currentQuestIndex');
      nextState = state.deleteIn(['questInfo', 'details', 'quests', action.index]);

      if (action.index < currentQuestIndex) {
        nextState = nextState.setIn(['questInfo', 'details', 'currentQuestIndex'], currentQuestIndex - 1);
      }

      return nextState;

    case FETCH_QUESTINFO:
      questInfo = {
        fetching: true,
        error: null,
        details: {
          defaultQuest: {
            places: [],
            types: [],
            descriptives: [],
          },
          quests: [
          ],
          currentQuestIndex: 0,
        },
      };

      nextState = state.setIn(['questInfo'], fromJS(questInfo));
      return nextState;

    case FETCH_QUESTINFO_SUCCESS:
      questInfo = {
        fetching: false,
        error: null,
        details: {
          defaultQuest: action.payload,
          quests: [
            action.payload,
          ],
          currentQuestIndex: 0,
        },
      };

      nextState = state.setIn(['questInfo'], fromJS(questInfo));
      return nextState;

    case FETCH_QUESTINFO_ERROR:
      questInfo = {
        fetching: false,
        error: true,
        details: {
          defaultQuest: {
            places: [],
            types: [],
            descriptives: [],
          },
          quests: [
          ],
          currentQuestIndex: 0,
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
