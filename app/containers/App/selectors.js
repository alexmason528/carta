import { createSelector } from 'reselect';

const selectGlobal = state => state.global;
const selectLocationState = () => state => state.route;

const selectAuthenticated = () => createSelector(
  selectGlobal,
  substate => substate.authenticated
)

const selectInfo = () => createSelector(
  selectGlobal,
  substate => ({ status: substate.status, error: substate.error })
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
