/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'
import globalReducer from 'containers/App/reducer'
import languageProviderReducer from 'containers/LanguageProvider/reducer'

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    route: routerReducer,
    form: formReducer,
    global: globalReducer,
    language: languageProviderReducer,
    ...asyncReducers,
  })
}
