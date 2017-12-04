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

  GET_QUESTINFO_REQUEST,
  GET_QUESTINFO_SUCCESS,
  GET_QUESTINFO_FAIL,

  GET_RECOMMENDATION_REQUEST,
  GET_RECOMMENDATION_SUCCESS,
  GET_RECOMMENDATION_FAIL,

  GET_BROCHURE_REQUEST,
  GET_BROCHURE_SUCCESS,
  GET_BROCHURE_FAIL,
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

    case GET_QUESTINFO_REQUEST:
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

    case GET_QUESTINFO_SUCCESS:
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

    case GET_QUESTINFO_FAIL:
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

    case GET_RECOMMENDATION_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case GET_RECOMMENDATION_SUCCESS:
      return {
        ...state,
        status: type,
        recommendations: payload,
      }

    case GET_RECOMMENDATION_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
        recommendations: [],
      }

    case GET_BROCHURE_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
        brochure: {},
      }

    case GET_BROCHURE_SUCCESS:
      return {
        ...state,
        status: type,
        brochure: payload,
      }

    case GET_BROCHURE_FAIL:
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
