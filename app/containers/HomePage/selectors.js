import { createSelector } from 'reselect'

const selectHome = state => state.home

const selectPosts = () => createSelector(selectHome, substate => substate.posts)

const selectSuggestions = () => createSelector(selectHome, substate => substate.suggestions)

const selectHomeInfo = () =>
  createSelector(selectHome, substate => ({
    status: substate.status,
    error: substate.error,
  }))

const selectEditingPost = () => createSelector(selectHome, substate => substate.editingPost)

const selectLimit = () => createSelector(selectHome, substate => substate.limit)

const selectHasMore = () => createSelector(selectHome, substate => substate.hasMore)

const selectHasQuest = () => createSelector(selectHome, substate => substate.hasQuest)

const selectLastPostDate = () => createSelector(selectHome, substate => substate.lastPostDate)

export {
  selectHome,
  selectPosts,
  selectSuggestions,
  selectHomeInfo,
  selectEditingPost,
  selectLimit,
  selectHasMore,
  selectHasQuest,
  selectLastPostDate,
}
