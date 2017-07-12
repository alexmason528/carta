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

const makeSelectZoomLevel = () => createSelector(
  selectHome,
  (homeState) => homeState.get('zoomlevel')
);

const makeSelectViewport = () => createSelector(
  selectHome,
  (homeState) => homeState.get('viewport')
);

export {
  selectHome,
  makeSelectCategories,
  makeSelectRecommendations,
  makeSelectZoomLevel,
  makeSelectViewport,
};
