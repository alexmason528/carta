/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectQuest = (state) => state.quest;

const selectQuestInfo = () => createSelector(
  selectQuest,
  (questState) => questState.questInfo
);

const selectRecommendations = () => createSelector(
  selectQuest,
  (questState) => questState.recommendations
);

const selectViewport = () => createSelector(
  selectQuest,
  (questState) => questState.viewport
);

const selectCategories = () => createSelector(
  selectQuest,
  (questState) => questState.questInfo.categories
);

const selectQuests = () => createSelector(
  selectQuest,
  (questState) => questState.questInfo.quests
);

const selectCurrentQuestIndex = () => createSelector(
  selectQuest,
  (questState) => questState.questInfo.currentQuestIndex
);

const selectPlaces = () => createSelector(
  selectQuest,
  (questState) => questState.questInfo.categories.places
);

const selectTypes = () => createSelector(
  selectQuest,
  (questState) => questState.questInfo.categories.types
);

const selectCurrentTypes = () => createSelector(
  selectQuest,
  (questState) => {
    const currentIndex = questState.questInfo.currentQuestIndex;
    const quests = questState.questInfo.quests;
    return quests[currentIndex].types;
  }
);

const selectDescriptives = () => createSelector(
  selectQuest,
  (questState) => questState.questInfo.categories.descriptives
);

const selectCurrentDescriptives = () => createSelector(
  selectQuest,
  (questState) => {
    const currentIndex = questState.questInfo.currentQuestIndex;
    const quests = questState.questInfo.quests;
    return quests[currentIndex].descriptives;
  }
);

const selectBrochure = () => createSelector(
  selectQuest,
  (questState) => questState.brochure
);

export {
  selectQuest,
  selectQuestInfo,
  selectRecommendations,
  selectViewport,
  selectCategories,
  selectQuests,
  selectCurrentQuestIndex,
  selectPlaces,
  selectTypes,
  selectCurrentTypes,
  selectDescriptives,
  selectCurrentDescriptives,
  selectBrochure,
};
