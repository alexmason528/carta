/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectCategories = () => createSelector(
  selectHome,
  (homeState) => homeState.get('categories')
);

const makeSelectRecommendations = () => createSelector(
  selectHome,
  (homeState) => homeState.get('recommendations')
);

export {
  selectHome,
  makeSelectCategories,
  makeSelectRecommendations,
};
