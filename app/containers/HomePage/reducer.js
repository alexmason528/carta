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
  FETCH_COMMUNITYINFO,
  FETCH_COMMUNITYINFO_SUCCESS,
  FETCH_COMMUNITYINFO_ERROR,
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
  },
});


function homeReducer(state = initialState, action) {
  let community;

  switch (action.type) {
    case FETCH_COMMUNITYINFO:
      return initialState;

    case FETCH_COMMUNITYINFO_SUCCESS:
      return state.setIn(['community', 'fetching'], false).setIn(['community', 'error'], null).setIn(['community', 'details'], fromJS(action.payload));

    case FETCH_COMMUNITYINFO_ERROR:
      return state.setIn(['community', 'fetching'], false).setIn(['community', 'error'], fromJS(action.payload));
    default:
      return state;
  }
}

export default homeReducer;
