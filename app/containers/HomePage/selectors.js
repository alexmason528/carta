import { createSelector } from 'reselect'

const selectHome = state => state.home

const selectPosts = () => createSelector(
  selectHome,
  substate => substate.posts
)

const selectSuggestions = () => createSelector(
  selectHome,
  substate => substate.suggestions
)

const selectInfo = () => createSelector(
  selectHome,
  substate => ({ status: substate.status, error: substate.error, curPost: substate.curPost })
)

export {
  selectHome,
  selectPosts,
  selectSuggestions,
  selectInfo,
}
