import { findIndex, find } from 'lodash'
import { DEFAULT_ZOOM, CENTER_COORDS } from 'containers/App/constants'
import { DEFAULT_LOCALE } from 'containers/LanguageProvider/constants'
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
  GET_BROCHURE_REQUEST,
  GET_BROCHURE_SUCCESS,
  GET_BROCHURE_FAIL,
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
  northeast: {
    x: 8.0192,
    y: 55.1867,
  },
  southwest: {
    x: 3.6247,
    y: 48.8738,
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
  quests: JSON.parse(getItem('quests')) || [
    JSON.parse(JSON.stringify(initialQuest)),
  ],
  curQuestInd: JSON.parse(getItem('curQuestInd')) || 0,
  recommendations: [],
  brochure: null,
  error: null,
  status: INIT,
}

function questReducer(state = initialState, { type, payload }) {
  const { curQuestInd, categories } = state
  let quests = JSON.parse(JSON.stringify(state.quests))
  let newQuests
  let newViewport

  switch (type) {
    case MAP_CHANGE:
      const { zoom, center, bounds: { _ne, _sw } } = payload
      newViewport = {
        ...state.viewport,
        center,
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

      setItem('viewport', JSON.stringify(newViewport))

      return {
        ...state,
        status: type,
        viewport: newViewport,
      }

    case PLACE_CLICK:
      newViewport = {
        ...state.viewport,
        center: [
          parseFloat(payload.x.toFixed(4)),
          parseFloat(payload.y.toFixed(4)),
        ],
        zoom: parseFloat(payload.zoom.toFixed(2)),
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
          let { type, active } = payload

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
          let {
            descriptives: { stars, includes, excludes, visibles, expanded },
          } = quest
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
            if (excludes.length === categories.types.length) {
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
            if (includes.length === categories.types.length) {
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

      return {
        ...state,
        status: type,
        quests: newQuests,
      }

    case QUEST_SELECT:
      setItem('curQuestInd', payload)
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          if (
            quest.descriptives.all ||
            quest.descriptives.includes.length > 0 ||
            quest.descriptives.stars.length > 0 ||
            quest.descriptives.visibles.length > 0
          ) {
            quest.descriptives.expanded = false
          }

          if (
            quest.types.all ||
            quest.types.includes.length > 0 ||
            quest.types.visibles.length > 0
          ) {
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

      return Object.assign(
        {},
        { ...state, status: type, quests },
        payload < curQuestInd && { curQuestInd: curQuestInd - 1 }
      )

    case SET_QUEST:
      const { quest: { viewport, types, descriptives }, urlEntered } = payload

      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          quest.types.includes = []
          quest.types.excludes = []

          quest.descriptives.stars = []
          quest.descriptives.includes = []
          quest.descriptives.excludes = []

          if (types) {
            quest.types.all = types.all
            if (urlEntered) {
              quest.types.visibles = []
            }

            for (let type of types.includes) {
              const typeObj = find(categories.types, {
                [DEFAULT_LOCALE]: getQuestStr(type),
              })
              if (typeObj && !find(quest.types.includes, typeObj)) {
                quest.types.includes.push(typeObj)
                if (urlEntered) {
                  quest.types.visibles.push(typeObj)
                }
              }
            }
            for (let type of types.excludes) {
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
          }

          if (descriptives) {
            if (descriptives === 'popular') {
              quest.descriptives.all = false
              quest.descriptives.visibles = []
              quest.descriptives.expanded = true
            } else {
              quest.descriptives.all = descriptives.all

              if (urlEntered) {
                quest.descriptives.visibles = []
              }

              for (let desc of descriptives.stars) {
                const descObj = find(categories.descriptives, {
                  [DEFAULT_LOCALE]: getQuestStr(desc),
                })
                if (descObj && !find(quest.descriptives.stars, descObj)) {
                  quest.descriptives.stars.push(descObj)
                  if (
                    urlEntered &&
                    !find(quest.descriptives.visibles, descObj)
                  ) {
                    quest.descriptives.visibles.push(descObj)
                  }
                }
              }
              for (let desc of descriptives.includes) {
                const descObj = find(categories.descriptives, {
                  [DEFAULT_LOCALE]: getQuestStr(desc),
                })
                if (descObj && !find(quest.descriptives.includes, descObj)) {
                  quest.descriptives.includes.push(descObj)
                  if (
                    urlEntered &&
                    !find(quest.descriptives.visibles, descObj)
                  ) {
                    quest.descriptives.visibles.push(descObj)
                  }
                }
              }
              for (let desc of descriptives.excludes) {
                const descObj = find(categories.descriptives, {
                  [DEFAULT_LOCALE]: getQuestStr(desc),
                })
                if (descObj && !find(quest.descriptives.excludes, descObj)) {
                  quest.descriptives.excludes.push(descObj)
                }
              }
            }
          }

          if (urlEntered) {
            if (
              quest.descriptives.all ||
              quest.descriptives.includes.length > 0 ||
              quest.descriptives.stars.length > 0 ||
              quest.descriptives.visibles.length > 0
            ) {
              quest.descriptives.expanded = false
            }
            if (
              quest.types.all ||
              quest.types.includes.length > 0 ||
              quest.types.visibles.length > 0
            ) {
              quest.types.expanded = false
            }
          }
        }
        return quest
      })

      newViewport = Object.assign(
        {},
        { ...state.viewport },
        viewport && { ...viewport }
      )

      setItem('viewport', JSON.stringify(newViewport))
      setItem('quests', JSON.stringify(newQuests))

      return {
        ...state,
        viewport: newViewport,
        status: urlEntered ? SET_URL_ENTERED_QUEST : SET_QUEST,
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
        brochure: null,
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
        status: type,
        error: payload,
        brochure: null,
      }

    case CLEAR_BROCHURE:
      return {
        ...state,
        status: type,
        brochure: null,
      }

    case TYPE_SEARCH_EXP_CHANGE:
      newQuests = quests.map((quest, index) => {
        if (index === curQuestInd) {
          quest.types.expanded = !quest.types.expanded
          if (quest.types.expanded) {
            quest.types.visibles = JSON.parse(
              JSON.stringify(quest.types.includes)
            )
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
            quest.descriptives.visibles = JSON.parse(
              JSON.stringify(quest.descriptives.includes)
            )
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
        if (
          quest.descriptives.all ||
          quest.descriptives.includes.length > 0 ||
          quest.descriptives.stars.length > 0 ||
          quest.descriptives.visibles.length > 0
        ) {
          quest.descriptives.expanded = false
        }
        if (
          quest.types.all ||
          quest.types.includes.length > 0 ||
          quest.types.visibles.length > 0
        ) {
          quest.types.expanded = false
        }
        return quest
      })

      return {
        ...state,
        status: type,
        quests: JSON.parse(JSON.stringify(newQuests)),
      }

    default:
      return state
  }
}

export default questReducer
