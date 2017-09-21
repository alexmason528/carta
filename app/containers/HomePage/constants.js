/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const MAP_CHANGE = 'carta/Home/MAP_CHANGE';
export const PLACE_SELECT = 'carta/Home/PLACE_SELECT';
export const TYPE_SELECT = 'carta/Home/TYPE_SELECT';
export const DESCRIPTIVE_SELECT = 'carta/Home/DESCRIPTIVE_SELECT';
export const UPDATE_VISIBILITY = 'carta/Home/UPDATE_VISIBILITY';
export const SET_DEFAULT_QUEST = 'carta/HOME/SET_DEFAULT_QUEST';

export const QUEST_ADD = 'carta/HOME/QUEST_ADD';
export const QUEST_SELECT = 'cara/HOME/QUEST_REMOVE';
export const QUEST_REMOVE = 'carta/HOME/QUEST_REMOVE';

export const FETCH_QUESTINFO = 'carta/Home/FETCH_QUESTINFO';
export const FETCH_QUESTINFO_SUCCESS = 'carta/Home/FETCH_QUESTINFO_SUCCESS';
export const FETCH_QUESTINFO_ERROR = 'carta/Home/FETCH_QUESTINFO_ERROR';

export const FETCH_RECOMMENDATIONS = 'carta/Home/FETCH_RECOMMENDATIONS';
export const FETCH_RECOMMENDATIONS_SUCCESS = 'carta/Home/FETCH_RECOMMENDATIONS_SUCCESS';
export const FETCH_RECOMMENDATIONS_ERROR = 'carta/Home/FETCH_RECOMMENDATIONS_ERROR';

export const FETCH_BROCHURE = 'carta/Home/FETCH_BROCHURE';
export const FETCH_BROCHURE_SUCCESS = 'carta/Home/FETCH_BROCHURE_SUCCESS';
export const FETCH_BROCHURE_ERROR = 'carta/Home/FETCH_BROCHURE_ERROR';

let API_DOMAIN = 'http://localhost:3000/';
if (process.env.NODE_ENV === 'production') API_DOMAIN = 'https://cartamap.herokuapp.com/';

export const API_BASE_URL = API_DOMAIN;
export const MAP_ACCESS_TOKEN = 'pk.eyJ1IjoiY2FydGFndWlkZSIsImEiOiJjajMzNG5rcjAwMDFmMnFud3hpNW8wenJpIn0.uQaLvmopUNSmyGSI1WKynw';
