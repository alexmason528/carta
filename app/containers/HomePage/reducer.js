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
        typesAll: 1,
        types: [],
        descriptivesAll: 0,
        descriptives: [],
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

    case MAP_CHANGE:
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

    case TYPE_SELECT:
      currentQuestIndex = state.get('questInfo').get('details').get('currentQuestIndex');
      let typesAll = state.get('questInfo').get('details').get('quests').get(currentQuestIndex).get('typesAll');

      if (action.name === 'anything') {
        typesAll = (typesAll === 1) ? 0 : 1;
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

      nextState = state.setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'types'], types)
                       .setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'typesAll'], typesAll);

      return nextState;

    case DESCRIPTIVE_SELECT:
      currentQuestIndex = state.get('questInfo').get('details').get('currentQuestIndex');
      let descriptivesAll = state.get('questInfo').get('details').get('quests').get(currentQuestIndex).get('descriptivesAll');

      if (action.name === 'anything') {
        descriptivesAll = (descriptivesAll === 1) ? 0 : 1;
        descriptives = state.get('questInfo').get('details').get('quests').get(currentQuestIndex).get('descriptives').map((descriptive) => {
          if (descriptivesAll === 0) {
            return descriptive.set('active', action.active).set('star', 0);
          }
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

      nextState = state.setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'descriptives'], descriptives)
                       .setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'descriptivesAll'], descriptivesAll);
      return nextState;

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

      nextState = state.setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'descriptives'], descriptives)
                       .setIn(['questInfo', 'details', 'quests', currentQuestIndex, 'types'], types);
      return nextState;

    case QUEST_ADD:
      const defaultQuest = state.get('questInfo').get('details').get('defaultQuest');
      const newQuests = state.get('questInfo').get('details').get('quests').push(defaultQuest);
      const size = state.get('questInfo').get('details').get('quests').size;

      nextState = state.setIn(['questInfo', 'details', 'quests'], newQuests).setIn(['questInfo', 'details', 'currentQuestIndex'], size);

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
            typesAll: 1,
            types: [],
            descriptivesAll: 0,
            descriptives: [],
          },
          quests: [
          ],
          currentQuestIndex: 0,
        },
      };

      nextState = state.set('questInfo', fromJS(questInfo));
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

      nextState = state.set('questInfo', fromJS(questInfo));
      return nextState;

    case FETCH_QUESTINFO_ERROR:
      questInfo = {
        fetching: false,
        error: true,
        details: {
          defaultQuest: {
            places: [],
            typesAll: 1,
            types: [],
            descriptivesAll: 0,
            descriptives: [],
          },
          quests: [
          ],
          currentQuestIndex: 0,
        },
      };

      nextState = state.set('questInfo', fromJS(questInfo));
      return nextState;

    case FETCH_RECOMMENDATIONS:
      recommendations = state.get('recommendations').set({
        fetching: true,
        error: null,
      });

      nextState = state.set('recommendations', fromJS(recommendations));
      return nextState;

    case FETCH_RECOMMENDATIONS_SUCCESS:
      recommendations = {
        fetching: false,
        error: null,
        details: action.payload,
      };

      nextState = state.set('recommendations', fromJS(recommendations));
      return nextState;

    case FETCH_RECOMMENDATIONS_ERROR:
      recommendations = {
        fetching: false,
        error: true,
        details: [],
      };

      nextState = state.set('recommendations', fromJS(recommendations));
      return nextState;

    default:
      return state;
  }
}

export default homeReducer;
