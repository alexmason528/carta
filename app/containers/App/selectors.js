/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = state => state.global;
const selectLocationState = () => state => state.route;

const selectLoginInfo = () => createSelector(
  selectGlobal,
  substate => substate.login
);

const selectRegisterInfo = () => createSelector(
  selectGlobal,
  substate => substate.register
);

const selectAuthenticated = () => createSelector(
  selectGlobal,
  substate => substate.authenticated
);

const selectUser = () => createSelector(
  selectGlobal,
  substate => substate.user
);

export {
  selectGlobal,
  selectLocationState,
  selectLoginInfo,
  selectRegisterInfo,
  selectAuthenticated,
  selectUser,
};
