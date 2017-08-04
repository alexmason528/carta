import { fromJS } from 'immutable';

import PlaceReducer from '../reducer';
import {
  changeUsername,
} from '../actions';

describe('PlaceReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      username: '',
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(PlaceReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle the changeUsername action correctly', () => {
    const fixture = 'mxstbr';
    const expectedResult = state.set('username', fixture);

    expect(PlaceReducer(state, changeUsername(fixture))).toEqual(expectedResult);
  });
});
