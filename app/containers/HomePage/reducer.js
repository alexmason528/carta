/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import {
  FETCH_COMMUNITYINFO_REQUEST,
  FETCH_COMMUNITYINFO_SUCCESS,
  FETCH_COMMUNITYINFO_ERROR,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from './constants';

// The initial state of the App

const initialState = fromJS({
  community: {
    fetching: false,
    error: null,
    details: {
      posts: [],
      suggestions: [],
    },
    authenticated: false,
    user: {},
    login: {
      fetching: false,
      error: null,
    },
    register: {
      fetching: false,
      error: null,
    },
  },
});


function homeReducer(state = initialState, action) {
  let community;

  switch (action.type) {
    case FETCH_COMMUNITYINFO_REQUEST:
      return initialState;

    case FETCH_COMMUNITYINFO_SUCCESS:
      return state.setIn(['community', 'fetching'], false).setIn(['community', 'error'], null).setIn(['community', 'details'], fromJS(action.payload));

    case FETCH_COMMUNITYINFO_ERROR:
      return state.setIn(['community', 'fetching'], false).setIn(['community', 'error'], fromJS(action.payload));

    case LOGIN_REQUEST:
      return state.setIn(['community', 'login', 'fetching'], true).setIn(['community', 'login', 'error'], null).setIn(['community', 'user'], {});

    case LOGIN_SUCCESS:
      return state.setIn(['community', 'login', 'fetching'], false).setIn(['community', 'login', 'error'], null).setIn(['community', 'authenticated'], true).setIn(['community', 'user'], action.payload);

    case LOGIN_ERROR:
      return state.setIn(['community', 'login', 'fetching'], false).setIn(['community', 'login', 'error'], action.payload).setIn(['community', 'authenticated'], false).setIn(['community', 'user'], {});

    default:
      return state;
  }
}

export default homeReducer;
