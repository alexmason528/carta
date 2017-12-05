import {
  MAP_CHANGE,
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

const initialQuest = {
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

const initialState = {
  categories: {
    places: [],
    types: [],
    descriptives: [],
  },
  quests: [initialQuest],
  selectedQuest: 0,
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
  let quests = state.quests.slice()

  switch (type) {

    case MAP_CHANGE:
      const { zoom, bounds: { _ne, _sw } } = payload
      return {
        ...state,
        status: type,
        viewport: {
          zoom,
          northeast: {
            x: _ne.lng,
            y: _ne.lat,
          },
          southwest: {
            x: _sw.lng,
            y: _sw.lat,
          },
        },
      }

    case TYPE_SELECT:
      quests[state.selectedQuest].types = payload
      return {
        ...state,
        status: type,
        quests,
      }

    case DESCRIPTIVE_SELECT:
      quests[state.selectedQuest].descriptives = payload
      return {
        ...state,
        status: type,
        quests,
      }

    case QUEST_ADD:
      return {
        ...state,
        status: type,
        quests: [...state.quests, initialQuest],
      }

    case QUEST_SELECT:
      return {
        ...state,
        status: type,
        selectedQuest: payload,
      }

    case QUEST_REMOVE:
      const { selectedQuest } = state

      return Object.assign({},
        state,
        {
          status: type,
          quests: quests.splice(payload, 1),
        },
        (payload < selectedQuest) && { selectedQuest: selectedQuest - 1 },
      )

    case SET_DEFAULT_QUEST:
      return state

    case GET_QUESTINFO_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case GET_QUESTINFO_SUCCESS:
      return {
        ...state,
        status: type,
        error: null,
        categories: payload,
      }

    case GET_QUESTINFO_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
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
      }

    case GET_BROCHURE_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
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
      }

    default:
      return state
  }
}

export default questReducer
