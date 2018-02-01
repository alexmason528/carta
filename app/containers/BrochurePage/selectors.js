import { createSelector } from 'reselect'
import { get, pick } from 'lodash'

const selectBrochureState = state => get(state, 'brochure')

const selectBrochureDetail = () => createSelector(selectBrochureState, substate => get(substate, 'detail'))

const selectBrochureInfo = () => createSelector(selectBrochureState, substate => pick(substate, ['status', 'error']))

export { selectBrochureDetail, selectBrochureInfo }
