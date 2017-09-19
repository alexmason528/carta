/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectQuestInfo = () => createSelector(
  selectHome,
  (homeState) => homeState.get('questInfo')
);

const makeSelectRecommendations = () => createSelector(
  selectHome,
  (homeState) => homeState.get('recommendations')
);

const makeSelectViewport = () => createSelector(
  selectHome,
  (homeState) => homeState.get('viewport')
);

const makeSelectCategories = () => createSelector(
  selectHome,
  (homeState) => homeState.get('questInfo').get('categories')
);

const makeSelectQuests = () => createSelector(
  selectHome,
  (homeState) => homeState.get('questInfo').get('quests')
);

const makeSelectCurrentQuestIndex = () => createSelector(
  selectHome,
  (homeState) => homeState.get('questInfo').get('currentQuestIndex')
);

const makeSelectPlaces = () => createSelector(
  selectHome,
  (homeState) => homeState.get('questInfo').get('categories').get('places').toJS()
);

const makeSelectTypes = () => createSelector(
  selectHome,
  (homeState) => homeState.get('questInfo').get('categories').get('types').toJS()
);

const makeSelectCurrentTypes = () => createSelector(
  selectHome,
  (homeState) => {
    const currentIndex = homeState.getIn(['questInfo', 'currentQuestIndex']);
    const quests = homeState.getIn(['questInfo', 'quests']).toJS();
    return quests[currentIndex].types;
  }
);

const makeSelectDescriptives = () => createSelector(
  selectHome,
  (homeState) => homeState.get('questInfo').get('categories').get('descriptives').toJS()
);

const makeSelectCurrentDescriptives = () => createSelector(
  selectHome,
  (homeState) => {
    const currentIndex = homeState.getIn(['questInfo', 'currentQuestIndex']);
    const quests = homeState.getIn(['questInfo', 'quests']).toJS();
    return quests[currentIndex].descriptives;
  }
);

export {
  selectHome,
  makeSelectQuestInfo,
  makeSelectRecommendations,
  makeSelectViewport,
  makeSelectCategories,
  makeSelectQuests,
  makeSelectCurrentQuestIndex,
  makeSelectPlaces,
  makeSelectTypes,
  makeSelectCurrentTypes,
  makeSelectDescriptives,
  makeSelectCurrentDescriptives,
};
