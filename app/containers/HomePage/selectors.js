/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectQuestInfo = () => createSelector(
  selectHome,
  (homeState) => homeState.get('questInfo')
);

const makeSelectCurrentPlace = () => createSelector(
  selectHome,
  (homeState) => homeState.get('currentPlace')
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
  makeSelectQuestInfo,
  makeSelectCurrentPlace,
  makeSelectRecommendations,
  makeSelectZoomLevel,
  makeSelectViewport,
};
