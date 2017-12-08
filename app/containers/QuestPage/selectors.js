import { createSelector } from 'reselect'
import { get, pick } from 'lodash'

const selectQuest = state => get(state, 'quest')

const selectRecommendations = () => createSelector(
  selectQuest,
  substate => get(substate, 'recommendations')
)

const selectViewport = () => createSelector(
  selectQuest,
  substate => get(substate, 'viewport')
)

const selectQuestCnt = () => createSelector(
  selectQuest,
  substate => substate.quests.length
)

const selectCurQuestInd = () => createSelector(
  selectQuest,
  substate => get(substate, 'curQuestInd')
)

const selectPlaces = () => createSelector(
  selectQuest,
  substate => get(substate, 'categories.places')
)

const selectTypes = () => createSelector(
  selectQuest,
  substate => get(substate, 'categories.types')
)

const selectCurrentTypes = () => createSelector(
  selectQuest,
  substate => substate.quests[substate.curQuestInd].types
)

const selectDescriptives = () => createSelector(
  selectQuest,
  substate => get(substate, 'categories.descriptives')
)

const selectCurrentDescriptives = () => createSelector(
  selectQuest,
  substate => substate.quests[substate.curQuestInd].descriptives
)

const selectBrochure = () => createSelector(
  selectQuest,
  substate => get(substate, 'brochure')
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
  selectQuestCnt,
  selectCurQuest,
  selectCurQuestInd,
  selectPlaces,
  selectTypes,
  selectCurrentTypes,
  selectDescriptives,
  selectCurrentDescriptives,
  selectBrochure,
  selectInfo,
}
