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
  FETCH_QUESTINFO_FAIL,

  FETCH_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_SUCCESS,
  FETCH_RECOMMENDATIONS_FAIL,

  FETCH_BROCHURE,
  FETCH_BROCHURE_SUCCESS,
  FETCH_BROCHURE_FAIL,
} from './constants'

const initialState = {
  questInfo: {
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
        anything: false,
        active: [],
        inactive: [],
      },
      descriptives: {
        anything: false,
        star: [],
        active: [],
        inactive: [],
      },
    }],
    currentQuestIndex: 0,
  },
  recommendations: [],

  viewport: {
    zoom: 7,
    northeast: {},
    southwest: {},
  },

  brochure: {},
  status: null,
  error: null,
}


function questReducer(state = initialState, { type, payload }) {
  let questInfo
  let recommendations
  let currentQuestIndex
  let types
  let descriptives
  let quests
  let brochure

  switch (type) {

    case MAP_CHANGE:
      return {
        ...state,
        status: type,
        viewport: {
          zoom: payload.zoom,
          northeast: {
            x: payload.bounds._ne.lng,
            y: payload.bounds._ne.lat,
          },
          southwest: {
            x: payload.bounds._sw.lng,
            y: payload.bounds._sw.lat,
          },
        },
      }

    case PLACE_SELECT:
      currentQuestIndex = state.questInfo.currentQuestIndex
      quests = state.questInfo.quests
      quests[currentQuestIndex].place = payload

      return {
        ...state,
        status: type,
        questInfo: {
          ...state.questInfo,
          quests,
        },
      }

    case TYPE_SELECT:
      currentQuestIndex = state.questInfo.currentQuestIndex
      quests = state.questInfo.quests
      quests[currentQuestIndex].types = payload
      return {
        ...state,
        status: type,
        questInfo: {
          ...state.questInfo,
          quests,
        },
      }

    case DESCRIPTIVE_SELECT:
      currentQuestIndex = state.questInfo.currentQuestIndex
      quests = state.questInfo.quests
      quests[currentQuestIndex].descriptives = payload

      return {
        ...state,
        status: type,
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
          anything: false,
          active: [],
          inactive: [],
        },
        descriptives: {
          anything: false,
          star: [],
          active: [],
          inactive: [],
        },
      }

      const newState = {
        ...state,
        status: type,
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
        status: type,
        questInfo: {
          ...state.questInfo,
          currentQuestIndex: payload,
        },
      }

    case QUEST_REMOVE:
      currentQuestIndex = state.questInfo.currentQuestIndex
      let newQuests = [...state.questInfo.quests]
      newQuests.splice(payload, 1)

      if (payload < currentQuestIndex) {
        return {
          ...state,
          status: type,
          questInfo: {
            ...state.questInfo,
            quests: newQuests,
            currentQuestIndex: currentQuestIndex - 1,
          },
        }
      }

      return {
        ...state,
        status: type,
        questInfo: {
          ...state.questInfo,
          quests: newQuests,
        },
      }

    case SET_DEFAULT_QUEST:
      return state

    case FETCH_QUESTINFO:
      questInfo = {
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
        status: type,
        error: null,
        questInfo,
      }

    case FETCH_QUESTINFO_SUCCESS:
      questInfo = {
        categories: payload,
        quests: initialState.questInfo.quests,
        currentQuestIndex: 0,
      }

      return {
        ...state,
        status: type,
        error: null,
        questInfo,
      }

    case FETCH_QUESTINFO_FAIL:
      questInfo = {
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
        status: type,
        error: payload,
        questInfo,
      }

    case FETCH_RECOMMENDATIONS:
      return {
        ...state,
        status: type,
        error: null,
      }

    case FETCH_RECOMMENDATIONS_SUCCESS:
      return {
        ...state,
        status: type,
        recommendations: payload,
      }

    case FETCH_RECOMMENDATIONS_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
        recommendations: [],
      }

    case FETCH_BROCHURE:
      return {
        ...state,
        status: type,
        error: null,
        brochure: {},
      }

    case FETCH_BROCHURE_SUCCESS:
      return {
        ...state,
        status: type,
        brochure: payload,
      }

    case FETCH_BROCHURE_FAIL:
      return {
        ...state,
        error: payload,
        brochure: {},
      }

    default:
      return state
  }
}

export default questReducer
