import { createSelector } from 'reselect'
import { get } from 'lodash'

const selectWishlistState = state => get(state, 'wishlist')

const selectWishlist = () => createSelector(selectWishlistState, substate => get(substate, 'wishlist'))

export { selectWishlist }
