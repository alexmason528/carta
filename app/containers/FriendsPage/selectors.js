import { createSelector } from 'reselect'
import { get } from 'lodash'

const selectFriendsState = state => get(state, 'friends')

const selectFriends = () => createSelector(selectFriendsState, substate => get(substate, 'friends'))

const selectFullname = () => createSelector(selectFriendsState, substate => get(substate, 'fullname'))

const selectHolidayPic = () => createSelector(selectFriendsState, substate => get(substate, 'holidayPic'))

export { selectFriends, selectFullname, selectHolidayPic }
