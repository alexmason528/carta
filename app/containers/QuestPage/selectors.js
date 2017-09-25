/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectQuest = (state) => state.get('quest');

const makeSelectQuestInfo = () => createSelector(
  selectQuest,
  (homeState) => homeState.get('questInfo')
);

const makeSelectRecommendations = () => createSelector(
  selectQuest,
  (homeState) => homeState.get('recommendations')
);

const makeSelectViewport = () => createSelector(
  selectQuest,
  (homeState) => homeState.get('viewport')
);

const makeSelectCategories = () => createSelector(
  selectQuest,
  (homeState) => homeState.get('questInfo').get('categories')
);

const makeSelectQuests = () => createSelector(
  selectQuest,
  (homeState) => homeState.get('questInfo').get('quests')
);

const makeSelectCurrentQuestIndex = () => createSelector(
  selectQuest,
  (homeState) => homeState.get('questInfo').get('currentQuestIndex')
);

const makeSelectPlaces = () => createSelector(
  selectQuest,
  (homeState) => homeState.get('questInfo').get('categories').get('places').toJS()
);

const makeSelectTypes = () => createSelector(
  selectQuest,
  (homeState) => homeState.get('questInfo').get('categories').get('types').toJS()
);

const makeSelectCurrentTypes = () => createSelector(
  selectQuest,
  (homeState) => {
    const currentIndex = homeState.getIn(['questInfo', 'currentQuestIndex']);
    const quests = homeState.getIn(['questInfo', 'quests']).toJS();
    return quests[currentIndex].types;
  }
);

const makeSelectDescriptives = () => createSelector(
  selectQuest,
  (homeState) => homeState.get('questInfo').get('categories').get('descriptives').toJS()
);

const makeSelectCurrentDescriptives = () => createSelector(
  selectQuest,
  (homeState) => {
    const currentIndex = homeState.getIn(['questInfo', 'currentQuestIndex']);
    const quests = homeState.getIn(['questInfo', 'quests']).toJS();
    return quests[currentIndex].descriptives;
  }
);

const makeSelectBrochure = () => createSelector(
  selectQuest,
  (homeState) => homeState.get('brochure')
);

export {
  selectQuest,
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
  makeSelectBrochure,
};
