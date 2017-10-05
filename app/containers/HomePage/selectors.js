/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectPosts = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['community', 'details', 'posts'])
);

const makeSelectSuggestions = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['community', 'details', 'suggestions'])
);

const makeSelectLogin = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['community', 'login'])
);

const makeSelectRegister = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['community', 'register'])
);

const makeSelectAuthenticated = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['community', 'authenticated'])
);

const makeSelectUser = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['community', 'user'])
);

export {
  selectHome,
  makeSelectPosts,
  makeSelectSuggestions,
  makeSelectLogin,
  makeSelectRegister,
  makeSelectAuthenticated,
  makeSelectUser,
};
