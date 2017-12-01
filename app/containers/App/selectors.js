import { createSelector } from 'reselect';

const selectGlobal = state => state.global
const selectLocationState = () => state => state.route

const selectAuthenticated = () => createSelector(
  selectGlobal,
  substate => substate.authenticated
)

const selectInfo = () => createSelector(
  selectGlobal,
  substate => {
    const { status, error, authMethod } = substate
    return { status, error, authMethod }
  }
)

const selectUser = () => createSelector(
  selectGlobal,
  substate => substate.user
)

export {
  selectGlobal,
  selectLocationState,
  selectAuthenticated,
  selectInfo,
  selectUser,
};
