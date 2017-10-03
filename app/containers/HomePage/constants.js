/*
 * QuestPage Constants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const FETCH_COMMUNITYINFO = 'carta/Home/FETCH_COMMUNITYINFO';
export const FETCH_COMMUNITYINFO_SUCCESS = 'carta/Home/FETCH_COMMUNITYINFO_SUCCESS';
export const FETCH_COMMUNITYINFO_ERROR = 'carta/Home/FETCH_COMMUNITYINFO_ERROR';

export const API_BASE_URL = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'https://cartamap.herokuapp.com/';
