/*
 * PlaceConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const FETCH_PLACE = 'carta/Place/FETCH_PLACE';
export const FETCH_PLACE_SUCCESS = 'carta/Place/FETCH_PLACE_SUCCESS';
export const FETCH_PLACE_ERROR = 'carta/Place/FETCH_PLACE_ERROR';

// export const API_BASE_URL = 'https://carta-backend-v2.appspot.com/';

let API_DOMAIN = 'http://localhost:3000/';
if (process.env.NODE_ENV === 'production') API_DOMAIN = 'https://carta-frontend-169512.appspot.com/';

export const API_BASE_URL = API_DOMAIN;
