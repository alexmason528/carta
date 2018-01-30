import { createSelector } from 'reselect'

const selectGlobal = state => state.global
const selectLocationState = () => state => state.route

const selectAuthenticated = () => createSelector(selectGlobal, substate => substate.authenticated)

const selectUserWishlist = () => createSelector(selectGlobal, substate => substate.wishlist)

const selectInfo = () =>
  createSelector(selectGlobal, substate => {
    const { status, error, authMethod } = substate
    return { status, error, authMethod }
  })

const selectUser = () => createSelector(selectGlobal, substate => substate.user)

const selectUsername = () => createSelector(selectGlobal, substate => (substate.user ? substate.user.username : ''))

const selectMenuState = () => createSelector(selectGlobal, substate => substate.menuOpened)

export { selectGlobal, selectLocationState, selectAuthenticated, selectUserWishlist, selectInfo, selectUser, selectUsername, selectMenuState }
