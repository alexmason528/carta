/**
 * Placepage selectors
 */

import { createSelector } from 'reselect';

const selectPlace = (state) => state.get('place');

const makeSelectPlace = () => createSelector(
  selectPlace,
  (PlaceState) => PlaceState.get('place')
);

export {
  selectPlace,
  makeSelectPlace,
};
