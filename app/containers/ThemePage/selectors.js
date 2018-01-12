import { createSelector } from 'reselect'
import { get } from 'lodash'

const selectTheme = state => get(state, 'theme')

const selectThemes = () =>
  createSelector(selectTheme, substate => get(substate, 'themes'))

export { selectThemes }
