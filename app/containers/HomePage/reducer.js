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
import {
  FETCH_COMMUNITYINFO_REQUEST,
  FETCH_COMMUNITYINFO_SUCCESS,
  FETCH_COMMUNITYINFO_ERROR,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from './constants';

// The initial state of the App

const initialState = {
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
};

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_COMMUNITYINFO_REQUEST:
      return initialState;

    case FETCH_COMMUNITYINFO_SUCCESS:
      return {
        ...state,
        community: {
          fetching: false,
          error: null,
          details: action.payload,
        },
      };

    case FETCH_COMMUNITYINFO_ERROR:
      return {
        ...state,
        community: {
          fetching: false,
          error: action.payload,
        },
      };

    case LOGIN_REQUEST:
      return {
        ...state,
        community: {
          ...state.community,
          login: {
            fetching: true,
            error: null,
            user: {},
          },
        },
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        community: {
          ...state.community,
          login: {
            fetching: false,
            error: null,
          },
          authenticated: true,
          user: action.payload,
        },
      };

    case LOGIN_ERROR:
      return {
        ...state,
        community: {
          ...state.community,
          login: {
            fetching: false,
            error: action.payload,
          },
          authenticated: false,
          user: {},
        },
      };

    default:
      return state;
  }
}

export default homeReducer;
