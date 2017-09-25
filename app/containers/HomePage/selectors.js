/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectBrochure = () => createSelector(
  selectHome,
  (homeState) => homeState.get('brochure')
);

export {
  selectHome,
  makeSelectBrochure,
};
