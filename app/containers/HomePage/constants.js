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

export const CHANGE_USERNAME = 'carta/Home/CHANGE_USERNAME';
export const TOGGLE_CATEGORY = 'carta/Home/TOGGLE_CATEGORY';

export const FETCH_CATEGORIES = 'carta/Home/FETCH_CATEGORIES';
export const FETCH_CATEGORIES_SUCCESS = 'carta/Home/FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_ERROR = 'carta/Home/FETCH_CATEGORIES_ERROR';

export const FETCH_RECOMMENDATIONS = 'carta/Home/FETCH_RECOMMENDATIONS';
export const FETCH_RECOMMENDATIONS_SUCCESS = 'carta/Home/FETCH_RECOMMENDATIONS_SUCCESS';
export const FETCH_RECOMMENDATIONS_ERROR = 'carta/Home/FETCH_RECOMMENDATIONS_ERROR';

export const API_BASE_URL = 'https://carta-168713.appspot.com/';
export const MAP_ACCESS_TOKEN = 'pk.eyJ1IjoiY2FydGFndWlkZSIsImEiOiJjajMzNG5rcjAwMDFmMnFud3hpNW8wenJpIn0.uQaLvmopUNSmyGSI1WKynw';
