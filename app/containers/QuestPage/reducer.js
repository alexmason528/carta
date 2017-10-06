/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true)
 */

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
} from './constants'

// The initial state of the App

const initialState = {
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
}


function questReducer(state = initialState, action) {
  let questInfo
  let recommendations
  let currentQuestIndex
  let types
  let descriptives
  let quests
  let brochure

  switch (action.type) {

    case MAP_CHANGE:
      return {
        ...state,
        viewport: {
          zoom: action.payload.zoom,
          northeast: {
            x: action.payload.bounds._ne.lng,
            y: action.payload.bounds._ne.lat,
          },
          southwest: {
            x: action.payload.bounds._sw.lng,
            y: action.payload.bounds._sw.lat,
          },
        },
      }

    case PLACE_SELECT:
      currentQuestIndex = state.questInfo.currentQuestIndex
      quests = state.questInfo.quests
      quests[currentQuestIndex].place = action.payload

      return {
        ...state,
        questInfo: {
          ...state.questInfo,
          quests,
        },
      }

    case TYPE_SELECT:
      currentQuestIndex = state.questInfo.currentQuestIndex
      quests = state.questInfo.quests
      quests[currentQuestIndex].types = action.payload

      return {
        ...state,
        questInfo: {
          ...state.questInfo,
          quests,
        },
      }

    case DESCRIPTIVE_SELECT:
      currentQuestIndex = state.questInfo.currentQuestIndex
      quests = state.questInfo.quests
      quests[currentQuestIndex].descriptives = action.payload

      return {
        ...state,
        questInfo: {
          ...state.questInfo,
          quests,
        },
      }

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
      }

      const newState = {
        ...state,
        questInfo: {
          ...state.questInfo,
          quests: [
            ...state.questInfo.quests,
            defaultQuest,
          ],
        },
      }

      return newState

    case QUEST_SELECT:
      return {
        ...state,
        questInfo: {
          ...state.questInfo,
          currentQuestIndex: action.payload,
        },
      }

    case QUEST_REMOVE:
      currentQuestIndex = state.questInfo.currentQuestIndex
      let newQuests = [...state.questInfo.quests]
      newQuests.splice(action.payload, 1)

      if (action.payload < currentQuestIndex) {
        return {
          ...state,
          questInfo: {
            ...state.questInfo,
            quests: newQuests,
            currentQuestIndex: currentQuestIndex - 1,
          },
        }
      }

      return {
        ...state,
        questInfo: {
          ...state.questInfo,
          quests: newQuests,
        },
      }

    case SET_DEFAULT_QUEST:
      return state

    case FETCH_QUESTINFO:
      questInfo = {
        fetching: true,
        error: null,
        categories: {
          places: [],
          types: [],
          descriptives: [],
        },
        quests: initialState.questInfo.quests,
        currentQuestIndex: 0,
      }

      return {
        ...state,
        questInfo,
      }

    case FETCH_QUESTINFO_SUCCESS:
      questInfo = {
        fetching: false,
        error: null,
        categories: action.payload,
        quests: initialState.questInfo.quests,
        currentQuestIndex: 0,
      }

      return {
        ...state,
        questInfo,
      }

    case FETCH_QUESTINFO_ERROR:
      questInfo = {
        fetching: false,
        error: action.payload,
        categories: {
          places: [],
          types: [],
          descriptives: [],
        },
        quests: initialState.questInfo.quests,
        currentQuestIndex: 0,
      }

      return {
        ...state,
        questInfo,
      }

    case FETCH_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          fetching: true,
          error: null,
        },
      }

    case FETCH_RECOMMENDATIONS_SUCCESS:
      return {
        ...state,
        recommendations: {
          fetching: false,
          error: null,
          details: action.payload,
        },
      }

    case FETCH_RECOMMENDATIONS_ERROR:
      return {
        ...state,
        recommendations: {
          fetching: false,
          error: action.payload,
          details: [],
        },
      }

    case FETCH_BROCHURE:
      return {
        ...state,
        brochure: {
          fetching: true,
          error: null,
          details: {},
        },
      }

    case FETCH_BROCHURE_SUCCESS:
      return {
        ...state,
        brochure: {
          fetching: false,
          error: null,
          details: action.payload,
        },
      }

    case FETCH_BROCHURE_ERROR:
      return {
        ...state,
        brochure: {
          fetching: false,
          error: action.payload,
          details: {},
        },
      }

    default:
      return state
  }
}

export default questReducer
