/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.home;

const selectPosts = () => createSelector(
  selectHome,
  (homeState) => homeState.community.details.posts
);

const selectSuggestions = () => createSelector(
  selectHome,
  (homeState) => homeState.community.details.suggestions
);

const selectLogin = () => createSelector(
  selectHome,
  (homeState) => homeState.community.login
);

const selectRegister = () => createSelector(
  selectHome,
  (homeState) => homeState.community.register
);

const selectAuthenticated = () => createSelector(
  selectHome,
  (homeState) => homeState.community.authenticated
);

const selectUser = () => createSelector(
  selectHome,
  (homeState) => homeState.community.user
);

export {
  selectHome,
  selectPosts,
  selectSuggestions,
  selectLogin,
  selectRegister,
  selectAuthenticated,
  selectUser,
};
