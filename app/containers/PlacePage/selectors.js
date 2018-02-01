import { createSelector } from 'reselect'
import { get } from 'lodash'

const selectPlaceState = state => get(state, 'place')

const selectPlaces = () => createSelector(selectPlaceState, substate => get(substate, 'places'))

export { selectPlaces }
