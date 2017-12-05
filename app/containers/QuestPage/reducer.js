import {
  MAP_CHANGE,

  TYPE_CLICK,
  TYPE_ANYTHING_CLICK,

  DESCRIPTIVE_CLICK,
  DESCRIPTIVE_STAR_CLICK,
  DESCRIPTIVE_ANYTHING_CLICK,

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
  types: [],
  typesAll: false,
  descriptives: [],
  descriptivesAll: false,
}

const initialState = {
  categories: {
    places: [],
    types: [],
    descriptives: [],
  },
  viewport: {
    x: 0,
    y: 0,
    zoomlevel: 0,
  },
  quests: [initialQuest],
  curQuestInd: 0,
  recommendations: [],
  brochure: {},
  status: null,
  error: null,
}


function questReducer(state = initialState, action) {
  let quests = state.quests.slice()
  const { categories, curQuestInd } = state
  const { types, typesAll, descriptives, descriptivesAll } = quests[curQuestInd]
  let newTypes
  let newDescriptives
  let activeCnt

  switch (action.type) {
    case MAP_CHANGE:
      const { zoom, bounds: { _ne, _sw } } = action.payload
      const viewport = {
        zoom,
        northeast: {
          x: _ne.lng,
          y: _ne.lat,
        },
        southwest: {
          x: _sw.lng,
          y: _sw.lat,
        },
      }

      return {
        ...state,
        status: action.type,
        viewport,
      }

    case TYPE_CLICK:
      newTypes = types.map((type, index) => {
        const { c, active } = type
        return (c === action.payload)
        ? Object.assign(
          type,
          { active: !active },
          !active && { visible: true })
        : type
      })
      quests[curQuestInd].types = newTypes

      activeCnt = 0
      for (let type of newTypes) {
        if (type.active) {
          activeCnt += 1
        }
      }

      if (activeCnt === 0) {
        quests[curQuestInd].typesAll = false
      } else if (activeCnt === types.length) {
        quests[curQuestInd].typesAll = true
      }

      return {
        ...state,
        status: action.type,
        quests,
      }

    case TYPE_ANYTHING_CLICK:
      newTypes = types.map(type => { return { ...type, active: !typesAll, visible: !typesAll } })
      quests[curQuestInd].types = newTypes
      quests[curQuestInd].typesAll = !typesAll

      return {
        ...state,
        status: action.type,
        quests,
      }

    case DESCRIPTIVE_CLICK:
      newDescriptives = descriptives.map(descriptive => {
        const { c, active } = descriptive
        return (c === action.payload)
        ? Object.assign(
          descriptive,
          { active: !active },
          active ? { star: false } : { visible: true })
        : descriptive
      })
      quests[curQuestInd].descriptives = newDescriptives

      activeCnt = 0
      for (let descriptive of newDescriptives) {
        if (descriptive.active) {
          activeCnt += 1
        }
      }

      if (activeCnt === 0) {
        quests[curQuestInd].descriptivesAll = false
      } else if (activeCnt === descriptives.length) {
        quests[curQuestInd].descriptivesAll = true
      }

      return {
        ...state,
        status: action.type,
        quests,
      }

    case DESCRIPTIVE_STAR_CLICK:
      newDescriptives = descriptives.map(descriptive => {
        const { c, star } = descriptive
        return (c === action.payload)
        ? Object.assign(
          descriptive,
          { star: !star })
        : descriptive
      })
      quests[curQuestInd].descriptives = newDescriptives

      return {
        ...state,
        status: action.type,
        quests,
      }

    case DESCRIPTIVE_ANYTHING_CLICK:
      newDescriptives = descriptives.map(descriptive => {
        return Object.assign(
          descriptive,
          { active: !descriptivesAll, visible: !descriptivesAll },
          descriptivesAll && { star: false },
        )
      })
      quests[curQuestInd].descriptives = newDescriptives
      quests[curQuestInd].descriptivesAll = !descriptivesAll

      return {
        ...state,
        status: action.type,
        quests,
      }

    case QUEST_ADD:
      return {
        ...state,
        status: JSON.parse(JSON.stringify(action.type)),
        quests: [...quests, { ...initialQuest, ...JSON.parse(JSON.stringify(categories)) }],
      }

    case QUEST_SELECT:
      return {
        ...state,
        status: action.type,
        curQuestInd: action.payload,
      }

    case QUEST_REMOVE:
      quests.splice(action.payload, 1)
      return Object.assign({},
        { ...state, status: action.type, quests },
        (action.payload < curQuestInd) && { curQuestInd: curQuestInd - 1 },
      )

    case SET_DEFAULT_QUEST:
      return state

    case GET_QUESTINFO_REQUEST:
      return {
        ...state,
        status: action.type,
        error: null,
      }

    case GET_QUESTINFO_SUCCESS:
      return {
        ...state,
        status: action.type,
        error: null,
        categories: JSON.parse(JSON.stringify(action.payload)),
        quests: [{ ...initialQuest, ...JSON.parse(JSON.stringify(action.payload)) }],
      }

    case GET_QUESTINFO_FAIL:
      return {
        ...state,
        status: action.type,
        error: action.payload,
      }

    case GET_RECOMMENDATION_REQUEST:
      return {
        ...state,
        status: action.type,
        error: null,
      }

    case GET_RECOMMENDATION_SUCCESS:
      return {
        ...state,
        status: action.type,
        recommendations: action.payload,
      }

    case GET_RECOMMENDATION_FAIL:
      return {
        ...state,
        status: action.type,
        error: action.payload,
      }

    case GET_BROCHURE_REQUEST:
      return {
        ...state,
        status: action.type,
        error: null,
      }

    case GET_BROCHURE_SUCCESS:
      return {
        ...state,
        status: action.type,
        brochure: action.payload,
      }

    case GET_BROCHURE_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default questReducer
