/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.global;
const selectLocationState = () => (state) => state.route;

export {
  selectGlobal,
  selectLocationState,
};
