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

export {
  selectHome,
  makeSelectPosts,
  makeSelectSuggestions,
};
