/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectProperties = () => createSelector(
  selectHome,
  (homeState) => homeState.get('properties')
);

const makeSelectRecommendations = () => createSelector(
  selectHome,
  (homeState) => homeState.get('recommendations')
);

export {
  selectHome,
  makeSelectProperties,
  makeSelectRecommendations,
};
