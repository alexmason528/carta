/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = state => state.global;
const selectLocationState = () => state => state.route;

const selectLoginError = () => createSelector(
  selectGlobal,
  substate => substate.loginError
);

const selectRegisterError = () => createSelector(
  selectGlobal,
  substate => substate.registerError
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
  selectLoginError,
  selectRegisterError,
  selectAuthenticated,
  selectUser,
};
