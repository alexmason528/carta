import { findIndex, find } from 'lodash'
import { getQuestStr } from 'utils/urlHelper'
import { CENTER_COORDS } from 'containers/App/constants'
import {
  MAP_CHANGE,

  PLACE_CLICK,

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
  types: {
    all: false,
    includes: [],
    excludes: [],
    visibles: [],
  },
  descriptives: {
    all: false,
    stars: [],
    includes: [],
    excludes: [],
    visibles: [],
  },
}

const initialState = {
  categories: {
    places: [],
    types: [],
    descriptives: [],
  },
  viewport: {
    northeast: {
      x: 8.019265624981585,
      y: 55.18678597629906,
    },
    southwest: {
      x: 3.624734374990169,
      y: 48.87383712585131,
    },
    center: {
      x: 5.822,
      y: 52.142,
    },
    zoom: 6,
  },
  quests: [JSON.parse(JSON.stringify(initialQuest))],
  curQuestInd: 0,
  recommendations: [],
  brochure: null,
  status: null,
  error: null,
}

function questReducer(state = initialState, { type, payload }) {
  const { curQuestInd, categories } = state
  let quests = JSON.parse(JSON.stringify(state.quests))
  let newQuests

  switch (type) {
    case MAP_CHANGE:
      const { zoom, bounds: { _ne, _sw }, center: { lng, lat } } = payload

      return {
        ...state,
        status: type,
        viewport: {
          ...state.viewport,
          zoom,
          northeast: {
            x: _ne.lng,
            y: _ne.lat,
          },
          southwest: {
            x: _sw.lng,
            y: _sw.lat,
          },
          center: {
            x: lng,
            y: lat,
          },
        },
      }

    case PLACE_CLICK:
      return {
        ...state,
        status: type,
        viewport: {
          ...state.viewport,
          center: {
            x: payload.x,
            y: payload.y,
          },
          zoom: payload.zoom,
        },
      }

    case TYPE_CLICK:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          let ind
          let { includes, excludes, visibles } = quest.types
          let { type, active } = payload
          if (active) {
            ind = findIndex(includes, type)
            if (ind !== -1) includes.splice(ind, 1)
            if (findIndex(excludes, type) === -1) excludes.push(type)
          } else {
            ind = findIndex(excludes, type)
            if (ind !== -1) excludes.splice(ind, 1)
            if (findIndex(includes, type) === -1) includes.push(type)
          }
          if (findIndex(visibles, type) === -1) visibles.push(type)
        }
        return quest
      })

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case TYPE_ANYTHING_CLICK:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          quest.types = {
            all: !quest.types.all,
            includes: [],
            excludes: [],
            visibles: [],
          }
        }
        return quest
      })

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case DESCRIPTIVE_CLICK:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          let ind
          let { stars, includes, excludes, visibles } = quest.descriptives
          const { desc, active } = payload
          if (active) {
            ind = findIndex(includes, desc)
            if (ind !== -1) includes.splice(ind, 1)
            ind = findIndex(stars, desc)
            if (ind !== -1) stars.splice(ind, 1)
            if (findIndex(excludes, desc) === -1) excludes.push(desc)
          } else {
            ind = findIndex(excludes, desc)
            if (ind !== -1) excludes.splice(ind, 1)
            if (findIndex(includes, desc) === -1) includes.push(desc)
          }
          if (findIndex(visibles, desc) === -1) visibles.push(desc)
        }
        return quest
      })

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case DESCRIPTIVE_STAR_CLICK:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          let ind
          let { stars, includes, excludes } = quest.descriptives
          const { desc, star } = payload
          if (star) {
            ind = findIndex(stars, desc)
            if (ind !== -1) stars.splice(ind, 1)
            if (findIndex(includes, desc) === -1) includes.push(desc)
          } else {
            ind = findIndex(includes, desc)
            if (ind !== -1) includes.splice(ind, 1)
            if (findIndex(stars, desc) === -1) stars.push(desc)
          }
        }
        return quest
      })

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case DESCRIPTIVE_ANYTHING_CLICK:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          const { all, stars } = quest.descriptives
          quest.descriptives = {
            stars: all ? [] : stars,
            includes: [],
            excludes: [],
            visibles: [],
            all: !all,
          }
        }
        return quest
      })

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case QUEST_ADD:
      return {
        ...state,
        status: type,
        quests: [...quests, JSON.parse(JSON.stringify(initialQuest))],
      }

    case QUEST_SELECT:
      return {
        ...state,
        status: type,
        curQuestInd: payload,
      }

    case QUEST_REMOVE:
      quests.splice(payload, 1)
      return Object.assign({},
        { ...state, status: type, quests },
        (payload < curQuestInd) && { curQuestInd: curQuestInd - 1 },
      )

    case SET_DEFAULT_QUEST:
      const { quest, locale } = payload
      const { viewport, types, descriptives } = quest

      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          quest.types.all = types.all
          for (let type of types.includes) {
            const typeObj = find(categories.types, { [locale]: getQuestStr(type) })
            if (typeObj) {
              quest.types.includes.push(typeObj)
            }
          }
          for (let type of types.excludes) {
            const typeObj = find(categories.types, { [locale]: getQuestStr(type) })
            if (typeObj) {
              quest.types.excludes.push(typeObj)
            }
          }

          quest.descriptives.all = descriptives.all
          for (let desc of descriptives.stars) {
            const descObj = find(categories.descriptives, { [locale]: getQuestStr(desc) })
            if (descObj) {
              quest.descriptives.stars.push(descObj)
            }
          }
          for (let desc of descriptives.includes) {
            const descObj = find(categories.descriptives, { [locale]: getQuestStr(desc) })
            if (descObj) {
              quest.descriptives.includes.push(descObj)
            }
          }
          for (let desc of descriptives.excludes) {
            const descObj = find(categories.descriptives, { [locale]: getQuestStr(desc) })
            if (descObj) {
              quest.descriptives.excludes.push(descObj)
            }
          }
        }
        return quest
      })

      return {
        ...state,
        viewport: {
          ...state.viewport,
          ...viewport,
        },
        status: type,
        quests: newQuests,
      }

    case UPDATE_VISIBILITY:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          quest.types.visibles = []
          quest.descriptives.visibles = []
        }
        return quest
      })

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

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
        categories: JSON.parse(JSON.stringify(payload)),
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
