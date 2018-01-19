import { createSelector } from 'reselect'

const selectLanguage = state => state.language

const selectLocale = () => createSelector(selectLanguage, substate => substate.locale)

export { selectLanguage, selectLocale }
