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

export {
  selectHome,
  selectPosts,
  selectSuggestions,
}
