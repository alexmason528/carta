import { createSelector } from 'reselect'
import { get } from 'lodash'

const selectProfileState = state => get(state, 'profile')

const selectProfile = () =>
  createSelector(selectProfileState, substate => get(substate, 'profile'))

export { selectProfileState, selectProfile }
