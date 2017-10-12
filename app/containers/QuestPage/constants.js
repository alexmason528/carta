/*
 * QuestPage Constants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT'
 */

export const MAP_CHANGE = 'carta/Quest/MAP_CHANGE'
export const PLACE_SELECT = 'carta/Quest/PLACE_SELECT'
export const TYPE_SELECT = 'carta/Quest/TYPE_SELECT'
export const DESCRIPTIVE_SELECT = 'carta/Quest/DESCRIPTIVE_SELECT'
export const UPDATE_VISIBILITY = 'carta/Quest/UPDATE_VISIBILITY'
export const SET_DEFAULT_QUEST = 'carta/Quest/SET_DEFAULT_QUEST'

export const QUEST_ADD = 'carta/Quest/QUEST_ADD'
export const QUEST_SELECT = 'cara/Quest/QUEST_REMOVE'
export const QUEST_REMOVE = 'carta/Quest/QUEST_REMOVE'

export const FETCH_QUESTINFO = 'carta/Quest/FETCH_QUESTINFO'
export const FETCH_QUESTINFO_SUCCESS = 'carta/Quest/FETCH_QUESTINFO_SUCCESS'
export const FETCH_QUESTINFO_FAIL = 'carta/Quest/FETCH_QUESTINFO_FAIL'

export const FETCH_RECOMMENDATIONS = 'carta/Quest/FETCH_RECOMMENDATIONS'
export const FETCH_RECOMMENDATIONS_SUCCESS = 'carta/Quest/FETCH_RECOMMENDATIONS_SUCCESS'
export const FETCH_RECOMMENDATIONS_FAIL = 'carta/Quest/FETCH_RECOMMENDATIONS_FAIL'

export const FETCH_BROCHURE = 'carta/Quest/FETCH_BROCHURE'
export const FETCH_BROCHURE_SUCCESS = 'carta/Quest/FETCH_BROCHURE_SUCCESS'
export const FETCH_BROCHURE_FAIL = 'carta/Quest/FETCH_BROCHURE_FAIL'

export const API_BASE_URL = process.env.API_BASE_URL
export const MAP_ACCESS_TOKEN = process.env.MAP_ACCESS_TOKEN
