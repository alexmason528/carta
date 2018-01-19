import { createSelector } from 'reselect'
import { get } from 'lodash'

const selectFriendsState = state => get(state, 'friends')

const selectFriends = () => createSelector(selectFriendsState, substate => get(substate, 'friends'))

export { selectFriends }
