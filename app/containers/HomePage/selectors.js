/**
 * Homepage selectors
 */

import { createSelector } from 'reselect'

const selectHome = state => state.home

const selectPosts = () => createSelector(
  selectHome,
  substate => substate.community.details.posts
)

const selectSuggestions = () => createSelector(
  selectHome,
  substate => substate.community.details.suggestions
)

export {
  selectHome,
  selectPosts,
  selectSuggestions,
}
