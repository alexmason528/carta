/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import {
  CHANGE_USERNAME,
  TOGGLE_CATEGORY,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  username: '',
  properties: [
    {
      category: 'love',
      value: 0
    },
    {
      category: 'drink',
      value: 0
    },
    {
      category: 'painting',
      value: 0
    },
    {
      category: 'history',
      value: 0
    },
    {
      category: 'outdoor',
      value: 0
    }
  ]
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_USERNAME:
      return state
        .set('username', action.name.replace(/@/gi, ''));
    case TOGGLE_CATEGORY:
      let abc = state.map(property => 
        (property.category == action.category)
          ? {...property, value: !property.value}
          : property
      )

      console.log(abc);
      return abc;
    default:
      return state;
  }
}

export default homeReducer;
