import { createSelector } from 'reselect'
import { get } from 'lodash'

const selectThemeState = state => get(state, 'theme')

const selectThemes = () => createSelector(selectThemeState, substate => get(substate, 'themes'))

export { selectThemes }
