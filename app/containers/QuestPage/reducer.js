import { findIndex, find } from 'lodash'
import { DEFAULT_LOCALE } from 'containers/LanguageProvider/constants'
import { DEFAULT_ZOOM, CENTER_COORDS } from 'utils/globalConstants'
import { getQuestStr } from 'utils/urlHelper'
import { getItem, setItem } from 'utils/localStorage'
import {
  INIT,
  MAP_CHANGE,
  TYPE_SEARCH_EXP_CHANGE,
  DESCRIPTIVE_SEARCH_EXP_CHANGE,
  UPDATE_EXPAND,
  PLACE_CLICK,
  TYPE_CLICK,
  TYPE_ANYTHING_CLICK,
  DESCRIPTIVE_CLICK,
  DESCRIPTIVE_STAR_CLICK,
  DESCRIPTIVE_ANYTHING_CLICK,
  SET_QUEST,
  SET_URL_ENTERED_QUEST,
  QUEST_ADD,
  QUEST_SELECT,
  QUEST_REMOVE,
  GET_QUESTINFO_REQUEST,
  GET_QUESTINFO_SUCCESS,
  GET_QUESTINFO_FAIL,
  GET_RECOMMENDATION_REQUEST,
  GET_RECOMMENDATION_SUCCESS,
  GET_RECOMMENDATION_FAIL,
  GET_BROCHURE_INFO_REQUEST,
  GET_BROCHURE_INFO_SUCCESS,
  GET_BROCHURE_INFO_FAIL,
  GET_DESCRIPTIVES_REQUEST,
  GET_DESCRIPTIVES_SUCCESS,
  GET_DESCRIPTIVES_FAIL,
  CLEAR_BROCHURE,
} from './constants'

export const initialQuest = {
  types: {
    all: false,
    includes: [],
    excludes: [],
    visibles: [],
    expanded: true,
  },
  descriptives: {
    all: false,
    stars: [],
    includes: [],
    excludes: [],
    visibles: [],
    expanded: true,
  },
}

const initialViewport = {
  bounds: {
    _ne: {
      lng: 8.0192,
      lat: 55.1867,
    },
    _sw: {
      lng: 3.6247,
      lat: 48.8738,
    },
  },
  center: CENTER_COORDS,
  zoom: DEFAULT_ZOOM,
}

const initialState = {
  categories: {
    places: [],
    types: [],
    descriptives: [],
  },
  viewport: JSON.parse(getItem('viewport')) || initialViewport,
  quests: JSON.parse(getItem('quests')) || [JSON.parse(JSON.stringify(initialQuest))],
  curQuestInd: JSON.parse(getItem('curQuestInd')) || 0,
  recommendations: [],
  brochureLink: null,
  brochureInfo: null,
  status: INIT,
  error: null,
}

function questReducer(state = initialState, { type, payload }) {
  const { curQuestInd, categories } = state
  let quests = JSON.parse(JSON.stringify(state.quests))
  let newQuests
  let newViewport

  switch (type) {
    case MAP_CHANGE:
      newViewport = {
        ...state.viewport,
        ...payload,
      }

      setItem('viewport', JSON.stringify(newViewport))

      return {
        ...state,
        status: type,
        viewport: newViewport,
      }

    case PLACE_CLICK:
      newViewport = {
        ...state.viewport,
        center: payload.center,
        zoom: payload.zoom,
      }

      setItem('viewport', JSON.stringify(newViewport))

      return {
        ...state,
        status: type,
        viewport: newViewport,
      }

    case TYPE_CLICK:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          let { types: { includes, excludes, visibles, expanded } } = quest
          const { type, active } = payload

          if (active) {
            includes.splice(findIndex(includes, type), 1)
            if (findIndex(excludes, type) === -1) {
              excludes.push(type)
              if (expanded) {
                visibles.splice(findIndex(visibles, type), 1)
              }
            }
            if (excludes.length === categories.types.length) {
              quest.types.all = false
            }
          } else {
            excludes.splice(findIndex(excludes, type), 1)
            if (expanded && findIndex(visibles, type) === -1) {
              visibles.push(type)
            }
            if (findIndex(includes, type) === -1) {
              includes.push(type)
            }
            if (includes.length === categories.types.length) {
              quest.types.all = true
            }
          }
        }
        return quest
      })

      setItem('quests', JSON.stringify(newQuests))

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case TYPE_ANYTHING_CLICK:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          const { all } = quest.types
          quest.types = Object.assign(
            {},
            {
              ...quest.types,
              all: !all,
              includes: [],
              excludes: [],
              visibles: [],
            },
            all && { expanded: true }
          )
        }
        return quest
      })

      setItem('quests', JSON.stringify(newQuests))

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case DESCRIPTIVE_CLICK:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          let { descriptives: { stars, includes, excludes, visibles, expanded } } = quest
          const { desc, active } = payload

          if (active) {
            includes.splice(findIndex(includes, desc), 1)
            stars.splice(findIndex(stars, desc), 1)
            if (findIndex(excludes, desc) === -1) {
              excludes.push(desc)
              if (expanded) {
                visibles.splice(findIndex(visibles, desc), 1)
              }
            }
            if (excludes.length === categories.descriptives.length) {
              quest.descriptives.all = false
            }
          } else {
            excludes.splice(findIndex(excludes, desc), 1)
            if (expanded && findIndex(visibles, desc) === -1) {
              visibles.push(desc)
            }
            if (findIndex(includes, desc) === -1) {
              includes.push(desc)
            }
            if (includes.length === categories.descriptives.length) {
              quest.descriptives.all = true
            }
          }
        }
        return quest
      })

      setItem('quests', JSON.stringify(newQuests))

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case DESCRIPTIVE_STAR_CLICK:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          let { descriptives: { stars, includes } } = quest
          const { desc, star } = payload
          if (star) {
            stars.splice(findIndex(stars, desc), 1)
            if (findIndex(includes, desc) === -1) includes.push(desc)
          } else {
            includes.splice(findIndex(includes, desc), 1)
            if (findIndex(stars, desc) === -1) stars.push(desc)
          }
        }
        return quest
      })

      setItem('quests', JSON.stringify(newQuests))

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case DESCRIPTIVE_ANYTHING_CLICK:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          const { all, stars } = quest.descriptives
          quest.descriptives = Object.assign(
            {},
            {
              ...quest.descriptives,
              all: !all,
              stars: all ? [] : stars,
              includes: [],
              excludes: [],
              visibles: [],
            },
            all && { expanded: true }
          )
        }
        return quest
      })

      setItem('quests', JSON.stringify(newQuests))

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case QUEST_ADD:
      newQuests = [...quests, JSON.parse(JSON.stringify(initialQuest))]

      setItem('quests', JSON.stringify(newQuests))
      setItem('curQuestInd', newQuests.length - 1)

      return {
        ...state,
        status: type,
        quests: newQuests,
        curQuestInd: newQuests.length - 1,
      }

    case QUEST_SELECT:
      setItem('curQuestInd', payload)
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          if (quest.descriptives.all || quest.descriptives.includes.length > 0 || quest.descriptives.stars.length > 0 || quest.descriptives.visibles.length > 0) {
            quest.descriptives.expanded = false
          }

          if (quest.types.all || quest.types.includes.length > 0 || quest.types.visibles.length > 0) {
            quest.types.expanded = false
          }
        }
        return quest
      })
      return {
        ...state,
        status: type,
        curQuestInd: payload,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case QUEST_REMOVE:
      quests.splice(payload, 1)

      setItem('quests', JSON.stringify(quests))

      if (payload < curQuestInd) {
        setItem('curQuestInd', curQuestInd - 1)
      }

      return Object.assign({}, { ...state, status: type, quests }, payload < curQuestInd && { curQuestInd: curQuestInd - 1 })

    case SET_QUEST:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          quest.types.includes = []
          quest.types.excludes = []

          quest.descriptives.stars = []
          quest.descriptives.includes = []
          quest.descriptives.excludes = []

          if (payload.quest.types) {
            quest.types.all = payload.quest.types.all
            if (payload.urlEntered) {
              quest.types.visibles = []
            }

            for (let type of payload.quest.types.includes) {
              const typeObj = find(categories.types, {
                [DEFAULT_LOCALE]: getQuestStr(type),
              })
              if (typeObj && !find(quest.types.includes, typeObj)) {
                quest.types.includes.push(typeObj)
                if (payload.urlEntered) {
                  quest.types.visibles.push(typeObj)
                }
              }
            }
            for (let type of payload.quest.types.excludes) {
              const typeObj = find(categories.types, {
                [DEFAULT_LOCALE]: getQuestStr(type),
              })
              if (typeObj && !find(quest.types.excludes, typeObj)) {
                quest.types.excludes.push(typeObj)
              }
              if (typeObj && !find(quest.types.visibles, typeObj)) {
                quest.types.visibles.push(typeObj)
              }
            }
          } else {
            quest.types.all = false
            quest.types.visibles = []
            quest.types.expanded = true
          }

          if (!payload.quest.descriptives || payload.quest.descriptives === 'popular') {
            quest.descriptives.all = false
            quest.descriptives.visibles = []
            quest.descriptives.expanded = true
          } else {
            quest.descriptives.all = payload.quest.descriptives.all

            if (payload.urlEntered) {
              quest.descriptives.visibles = []
            }

            for (let desc of payload.quest.descriptives.stars) {
              const descObj = find(categories.descriptives, {
                [DEFAULT_LOCALE]: getQuestStr(desc),
              })
              if (descObj && !find(quest.descriptives.stars, descObj)) {
                quest.descriptives.stars.push(descObj)
                if (payload.urlEntered && !find(quest.descriptives.visibles, descObj)) {
                  quest.descriptives.visibles.push(descObj)
                }
              }
            }
            for (let desc of payload.quest.descriptives.includes) {
              const descObj = find(categories.descriptives, {
                [DEFAULT_LOCALE]: getQuestStr(desc),
              })
              if (descObj && !find(quest.descriptives.includes, descObj)) {
                quest.descriptives.includes.push(descObj)
                if (payload.urlEntered && !find(quest.descriptives.visibles, descObj)) {
                  quest.descriptives.visibles.push(descObj)
                }
              }
            }
            for (let desc of payload.quest.descriptives.excludes) {
              const descObj = find(categories.descriptives, {
                [DEFAULT_LOCALE]: getQuestStr(desc),
              })
              if (descObj && !find(quest.descriptives.excludes, descObj)) {
                quest.descriptives.excludes.push(descObj)
              }
            }
          }
        }
        return quest
      })

      newViewport = Object.assign({}, { ...state.viewport }, payload.quest.viewport && { ...payload.quest.viewport })

      setItem('viewport', JSON.stringify(newViewport))
      setItem('quests', JSON.stringify(newQuests))

      return Object.assign(
        {},
        {
          ...state,
          viewport: newViewport,
          status: payload.urlEntered ? SET_URL_ENTERED_QUEST : SET_QUEST,
          quests: JSON.parse(JSON.stringify(newQuests)),
          brochureLink: payload.quest.brochure,
        }
      )

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
        recommendations: null,
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

    case GET_BROCHURE_INFO_REQUEST:
      return {
        ...state,
        status: type,
        brochureInfo: null,
        error: null,
      }

    case GET_BROCHURE_INFO_SUCCESS:
      return {
        ...state,
        status: type,
        brochureInfo: payload,
      }

    case GET_BROCHURE_INFO_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
        brochureInfo: null,
      }

    case TYPE_SEARCH_EXP_CHANGE:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          quest.types.expanded = !quest.types.expanded
          if (quest.types.expanded) {
            quest.types.visibles = JSON.parse(JSON.stringify(quest.types.includes))
          }
        }
        return quest
      })

      setItem('quests', JSON.stringify(newQuests))

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case DESCRIPTIVE_SEARCH_EXP_CHANGE:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          quest.descriptives.expanded = !quest.descriptives.expanded
          if (quest.descriptives.expanded) {
            quest.descriptives.visibles = JSON.parse(JSON.stringify(quest.descriptives.includes))
          }
        }
        return quest
      })

      setItem('quests', JSON.stringify(newQuests))

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case UPDATE_EXPAND:
      newQuests = quests.map(quest => {
        if (quest.descriptives.all || quest.descriptives.includes.length > 0 || quest.descriptives.stars.length > 0 || quest.descriptives.visibles.length > 0) {
          quest.descriptives.expanded = false
        }
        if (quest.types.all || quest.types.includes.length > 0 || quest.types.visibles.length > 0) {
          quest.types.expanded = false
        }
        return quest
      })

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    case GET_DESCRIPTIVES_REQUEST:
      return {
        ...state,
        status: type,
      }

    case GET_DESCRIPTIVES_SUCCESS:
      return {
        ...state,
        status: type,
        categories: {
          ...state.categories,
          descriptives: payload,
        },
      }

    case GET_DESCRIPTIVES_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case CLEAR_BROCHURE:
      return {
        ...state,
        status: type,
        brochureInfo: null,
        brochureLink: null,
      }

    default:
      return state
  }
}

export default questReducer
