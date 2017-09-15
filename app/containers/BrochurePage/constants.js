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

export const FETCH_BROCHURE = 'carta/Brochure/FETCH_BROCHURE';
export const FETCH_BROCHURE_SUCCESS = 'carta/Brochure/FETCH_BROCHURE_SUCCESS';
export const FETCH_BROCHURE_ERROR = 'carta/Brochure/FETCH_BROCHURE_ERROR';

let API_DOMAIN = 'http://localhost:3000/';
if (process.env.NODE_ENV === 'production') API_DOMAIN = 'https://cartamap.herokuapp.com/';

export const API_BASE_URL = API_DOMAIN;
