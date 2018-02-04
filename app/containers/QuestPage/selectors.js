import { createSelector } from 'reselect'
import { get, pick } from 'lodash'

const selectQuestState = state => get(state, 'quest')

const selectRecommendations = () => createSelector(selectQuestState, substate => get(substate, 'recommendations'))

const selectViewport = () => createSelector(selectQuestState, substate => get(substate, 'viewport'))

const selectCurQuestInd = () => createSelector(selectQuestState, substate => get(substate, 'curQuestInd'))

const selectPlaces = () => createSelector(selectQuestState, substate => get(substate, 'categories.places'))

const selectTypes = () => createSelector(selectQuestState, substate => get(substate, 'categories.types'))

const selectCurrentTypes = () => createSelector(selectQuestState, substate => get(substate, 'quest.types'))

const selectDescriptives = () => createSelector(selectQuestState, substate => get(substate, 'categories.descriptives'))

const selectCurrentDescriptives = () => createSelector(selectQuestState, substate => get(substate, 'quest.descriptives'))

const selectInfo = () => createSelector(selectQuestState, substate => pick(substate, ['status', 'error']))

const selectCurrentQuest = () => createSelector(selectQuestState, substate => get(substate, 'quest'))

const selectTypeSearchExpanded = () => createSelector(selectQuestState, substate => get(substate, 'quest.types.expanded'))

const selectDescriptiveSearchExpanded = () => createSelector(selectQuestState, substate => get(substate, 'quest.descriptives.expanded'))

const selectPanelState = () => createSelector(selectQuestState, substate => get(substate, 'panelState'))

export {
  selectRecommendations,
  selectViewport,
  selectCategories,
  selectPanelState,
  selectCurQuest,
  selectCurQuestInd,
  selectPlaces,
  selectTypes,
  selectCurrentTypes,
  selectDescriptives,
  selectCurrentDescriptives,
  selectInfo,
  selectCurrentQuest,
  selectTypeSearchExpanded,
  selectDescriptiveSearchExpanded,
}
