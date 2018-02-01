import { createSelector } from 'reselect'
import { get } from 'lodash'

const selectLanguageState = state => get(state, 'language')

const selectLocale = () => createSelector(selectLanguageState, substate => get(substate, 'locale'))

export { selectLocale }
