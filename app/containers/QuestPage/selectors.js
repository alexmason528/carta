import { createSelector } from 'reselect'

const selectQuest = state => state.quest

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
  substate => substate.categories
)

const selectQuests = () => createSelector(
  selectQuest,
  substate => substate.quests
)

const selectCurrentQuestIndex = () => createSelector(
  selectQuest,
  substate => substate.selectedQuest
)

const selectPlaces = () => createSelector(
  selectQuest,
  substate => substate.categories.places
)

const selectTypes = () => createSelector(
  selectQuest,
  substate => substate.categories.types
)

const selectCurrentTypes = () => createSelector(
  selectQuest,
  substate => substate.quests[substate.selectedQuest].types
)

const selectDescriptives = () => createSelector(
  selectQuest,
  substate => substate.categories.descriptives
)

const selectCurrentDescriptives = () => createSelector(
  selectQuest,
  substate => substate.quests[substate.selectedQuest].descriptives
)

const selectBrochure = () => createSelector(
  selectQuest,
  substate => substate.brochure
)

const selectInfo = () => createSelector(
  selectQuest,
  substate => ({ status: substate.status, error: substate.error })
)

export {
  selectQuest,
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
  selectInfo,
}
