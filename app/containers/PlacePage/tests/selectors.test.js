import { fromJS } from 'immutable';

import {
  selectPlace,
  makeSelectUsername,
} from '../selectors';

describe('selectPlace', () => {
  it('should select the Place state', () => {
    const PlaceState = fromJS({
      userData: {},
    });
    const mockedState = fromJS({
      Place: PlaceState,
    });
    expect(selectPlace(mockedState)).toEqual(PlaceState);
  });
});

describe('makeSelectUsername', () => {
  const usernameSelector = makeSelectUsername();
  it('should select the username', () => {
    const username = 'mxstbr';
    const mockedState = fromJS({
      Place: {
        username,
      },
    });
    expect(usernameSelector(mockedState)).toEqual(username);
  });
});
