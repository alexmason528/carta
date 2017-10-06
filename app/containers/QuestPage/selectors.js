/**
 * Homepage selectors
 */

import { createSelector } from 'reselect'

const selectQuest = state => state.quest

const selectQuestInfo = () => createSelector(
  selectQuest,
  substate => substate.questInfo
)

const selectRecommendations = () => createSelector(
  selectQuest,
  substate => substate.recommendations
)

const selectViewport = () => createSelector(
  selectQuest,
  substate => substate.viewport
)

const selectCategories = () => createSelector(
  selectQuest,
  substate => substate.questInfo.categories
)

const selectQuests = () => createSelector(
  selectQuest,
  substate => substate.questInfo.quests
)

const selectCurrentQuestIndex = () => createSelector(
  selectQuest,
  substate => substate.questInfo.currentQuestIndex
)

const selectPlaces = () => createSelector(
  selectQuest,
  substate => substate.questInfo.categories.places
)

const selectTypes = () => createSelector(
  selectQuest,
  substate => substate.questInfo.categories.types
)

const selectCurrentTypes = () => createSelector(
  selectQuest,
  substate => {
    const currentIndex = substate.questInfo.currentQuestIndex
    const quests = substate.questInfo.quests
    return quests[currentIndex].types
  }
)

const selectDescriptives = () => createSelector(
  selectQuest,
  substate => substate.questInfo.categories.descriptives
)

const selectCurrentDescriptives = () => createSelector(
  selectQuest,
  substate => {
    const currentIndex = substate.questInfo.currentQuestIndex
    const quests = substate.questInfo.quests
    return quests[currentIndex].descriptives
  }
)

const selectBrochure = () => createSelector(
  selectQuest,
  substate => substate.brochure
)

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
}
