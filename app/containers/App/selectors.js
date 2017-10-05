/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');
const selectLocationState = () => (state) => state.get('route');

export {
  selectGlobal,
  selectLocationState,
};
