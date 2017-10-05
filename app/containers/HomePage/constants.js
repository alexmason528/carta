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

export const FETCH_COMMUNITYINFO_REQUEST = 'carta/Home/FETCH_COMMUNITYINFO_REQUEST';
export const FETCH_COMMUNITYINFO_SUCCESS = 'carta/Home/FETCH_COMMUNITYINFO_SUCCESS';
export const FETCH_COMMUNITYINFO_ERROR = 'carta/Home/FETCH_COMMUNITYINFO_ERROR';

export const LOGIN_REQUEST = 'carta/Home/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'carta/Home/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'carta/Home/LOGIN_ERROR';

export const REGISTER_REQUEST = 'carta/Home/REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'carta/Home/REGISTER_SUCCESS';
export const REGISTER_ERROR = 'carta/Home/REGISTER_ERROR';

export const API_BASE_URL = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'https://cartamap.herokuapp.com/';
