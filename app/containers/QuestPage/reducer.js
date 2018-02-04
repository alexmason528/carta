import { find, get, pick } from 'lodash'
import { DEFAULT_LOCALE } from 'containers/LanguageProvider/constants'
import { getQuestStr, urlParser } from 'utils/urlHelper'
import { getItem, setItem } from 'utils/localStorage'
import {
  INIT,
  TYPE_SEARCH_EXP_CHANGE,
  DESCRIPTIVE_SEARCH_EXP_CHANGE,
  UPDATE_EXPAND,
  SET_QUEST,
  SET_URL_ENTERED_QUEST,
  SET_PANEL_STATE,
  GET_QUESTINFO_REQUEST,
  GET_QUESTINFO_SUCCESS,
  GET_QUESTINFO_FAIL,
  GET_RECOMMENDATION_REQUEST,
  GET_RECOMMENDATION_SUCCESS,
  GET_RECOMMENDATION_FAIL,
  GET_DESCRIPTIVES_REQUEST,
  GET_DESCRIPTIVES_SUCCESS,
  GET_DESCRIPTIVES_FAIL,
} from './constants'

const quests = JSON.parse(getItem('quests'))
const curQuestInd = JSON.parse(getItem('curQuestInd'))
const viewport = JSON.parse(getItem('viewport'))
const params = urlParser({ viewport, ...pick(quests[curQuestInd], ['types', 'descriptives']) })

const initialState = {
  categories: {
    places: [],
    types: [],
    descriptives: [],
  },
  viewport: get(params, 'viewport'),
  quest: pick(params, ['types', 'descriptives']),
  recommendations: [],
  panelState: 'opened',
  status: INIT,
  error: null,
}

function questReducer(state = initialState, { type, payload }) {
  const { categories } = state
  let quest = JSON.parse(JSON.stringify(state.quest))

  switch (type) {
    case SET_QUEST:
      const { viewport, types, descriptives } = urlParser({ ...payload.params })
      quest.types.includes = []
      quest.types.excludes = []

      quest.descriptives.stars = []
      quest.descriptives.includes = []
      quest.descriptives.excludes = []

      if (types) {
        quest.types.all = types.all
        if (payload.urlEntered) {
          quest.types.visibles = []
        }

        for (let type of types.includes) {
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
      } else {
        quest.types.all = false
        quest.types.visibles = []
      }

      if (quest.types.visibles.length === 0) {
        quest.types.expanded = true
      }

      if (!descriptives || descriptives === 'popular') {
        quest.descriptives.all = false
        quest.descriptives.visibles = []
        quest.descriptives.expanded = true
      } else {
        quest.descriptives.all = descriptives.all
        if (payload.urlEntered) {
          quest.descriptives.visibles = []
        }

        for (let desc of descriptives.stars) {
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
        for (let desc of descriptives.includes) {
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
        for (let desc of descriptives.excludes) {
          const descObj = find(categories.descriptives, {
            [DEFAULT_LOCALE]: getQuestStr(desc),
          })
          if (descObj && !find(quest.descriptives.excludes, descObj)) {
            quest.descriptives.excludes.push(descObj)
          }
        }
      }

      if (quest.descriptives.visibles.length === 0) {
        quest.descriptives.expanded = true
      }

      setItem('viewport', JSON.stringify(`${viewport.center.lng},${viewport.center.lat},${viewport.zoom}`))

      const curQuestInd = JSON.parse(getItem('curQuestInd'))
      let quests = JSON.parse(getItem('quests'))

      quests[curQuestInd] = pick(payload.params, ['types', 'descriptives'])
      setItem('quests', JSON.stringify(quests))

      return Object.assign(
        {},
        {
          ...state,
          viewport: {
            ...state.viewport,
            ...viewport,
          },
          status: payload.urlEntered ? SET_URL_ENTERED_QUEST : SET_QUEST,
          quest: JSON.parse(JSON.stringify(quest)),
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

    case TYPE_SEARCH_EXP_CHANGE:
      quest.types.expanded = !quest.types.expanded
      if (quest.types.expanded) {
        quest.types.visibles = JSON.parse(JSON.stringify(quest.types.includes))
      }

      return {
        ...state,
        status: type,
        quest: JSON.parse(JSON.stringify(quest)),
      }

    case DESCRIPTIVE_SEARCH_EXP_CHANGE:
      quest.descriptives.expanded = !quest.descriptives.expanded
      if (quest.descriptives.expanded) {
        quest.descriptives.visibles = JSON.parse(JSON.stringify(quest.descriptives.includes))
      }

      return {
        ...state,
        status: type,
        quest: JSON.parse(JSON.stringify(quest)),
      }

    case UPDATE_EXPAND:
      if (quest.descriptives.all || quest.descriptives.includes.length > 0 || quest.descriptives.stars.length > 0 || quest.descriptives.visibles.length > 0) {
        quest.descriptives.expanded = false
      }
      if (quest.types.all || quest.types.includes.length > 0 || quest.types.visibles.length > 0) {
        quest.types.expanded = false
      }

      return {
        ...state,
        status: type,
        quest: JSON.parse(JSON.stringify(quest)),
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

    case SET_PANEL_STATE:
      return {
        ...state,
        status: type,
        panelState: payload,
      }

    default:
      return state
  }
}

export default questReducer
