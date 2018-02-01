import { createSelector } from 'reselect'
import { get, pick } from 'lodash'

const selectGlobalState = state => get(state, 'global')

const selectLocationState = () => state => get(state, 'route')

const selectAuthenticated = () => createSelector(selectGlobalState, substate => get(substate, 'authenticated'))

const selectUserWishlist = () => createSelector(selectGlobalState, substate => get(substate, 'wishlist'))

const selectInfo = () => createSelector(selectGlobalState, substate => pick(substate, 'status', 'error', 'authMethod'))

const selectUser = () => createSelector(selectGlobalState, substate => get(substate, 'user'))

const selectUsername = () => createSelector(selectGlobalState, substate => get(substate, 'user.username', ''))

const selectMenuState = () => createSelector(selectGlobalState, substate => get(substate, 'menuOpened'))

export { selectLocationState, selectAuthenticated, selectUserWishlist, selectInfo, selectUser, selectUsername, selectMenuState }
