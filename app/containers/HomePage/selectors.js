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

const selectHomeInfo = () => createSelector(
  selectHome,
  substate => ({ status: substate.status, error: substate.error })
)

const selectEditingPost = () => createSelector(
  selectHome,
  substate => substate.editingPost,
)

export {
  selectHome,
  selectPosts,
  selectSuggestions,
  selectHomeInfo,
  selectEditingPost,
}
