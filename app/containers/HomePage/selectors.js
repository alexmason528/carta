/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectUsername = () => createSelector(
  selectHome,
  (homeState) => homeState.get('username')
);

const makeSelectProperties = () => createSelector(
	selectHome,
	(homeState) => homeState.get('properties')
);

export {
  selectHome,
  makeSelectUsername,
  makeSelectProperties
};
