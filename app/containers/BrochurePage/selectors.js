/**
 * Placepage selectors
 */

import { createSelector } from 'reselect';

const selectBrochure = (state) => state.get('brochure');

const makeSelectBrochure = () => createSelector(
  selectBrochure,
  (BrochureState) => BrochureState.get('brochure')
);

export {
  selectBrochure,
  makeSelectBrochure,
};
