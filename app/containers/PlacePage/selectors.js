import { createSelector } from 'reselect'
import { get } from 'lodash'

const selectPlace = state => get(state, 'place')

const selectPlaces = () => createSelector(selectPlace, substate => get(substate, 'places'))

export { selectPlaces }
