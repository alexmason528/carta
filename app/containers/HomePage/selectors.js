import { createSelector } from 'reselect'
import { get, pick } from 'lodash'

const selectHomeState = state => get(state, 'home')

const selectPosts = () => createSelector(selectHomeState, substate => get(substate, 'posts'))

const selectSuggestions = () => createSelector(selectHomeState, substate => get(substate, 'suggestions'))

const selectHomeInfo = () => createSelector(selectHomeState, substate => pick(substate, ['status', 'error']))

const selectEditingPost = () => createSelector(selectHomeState, substate => get(substate, 'editingPost'))

const selectLimit = () => createSelector(selectHomeState, substate => get(substate, 'limit'))

const selectHasMore = () => createSelector(selectHomeState, substate => get(substate, 'hasMore'))

const selectHasQuest = () => createSelector(selectHomeState, substate => get(substate, 'hasQuest'))

const selectLastPostDate = () => createSelector(selectHomeState, substate => get(substate, 'lastPostDate'))

export { selectPosts, selectSuggestions, selectHomeInfo, selectEditingPost, selectLimit, selectHasMore, selectHasQuest, selectLastPostDate }
