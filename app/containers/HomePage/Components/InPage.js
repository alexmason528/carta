import React, { PropTypes, Children } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Button, StarButton } from './Buttons';
import { placeSelect } from '../actions';

import './style.scss';

export class InPage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      places: [],
      search: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      places: nextProps.places,
    });
  }

  placeClicked = (placeName) => {
    this.props.placeSelect(placeName);
  }

  inputChangeHandler = (text) => {
    this.setState({
      search: text,
    });
  }

  render() {
    const { places, search } = this.state;

    let filteredPlaces;
    if (search === '') filteredPlaces = places;
    else filteredPlaces = places.filter((place) => place.name.toLowerCase().indexOf(search) !== -1);

    return (
      <div className={this.props.className}>
        <h1>In</h1>
        <input className="search-input" onChange={(evt) => { this.inputChangeHandler(evt.target.value); }} />
        <div className="buttons-row">
          { filteredPlaces.map((place, index) => <button className="place-button" key={index} onClick={() => { this.placeClicked(place.name); }}>{place.name}</button>) }
        </div>
      </div>
    );
  }
}

InPage.propTypes = {
  className: PropTypes.string,
  places: PropTypes.array,
  placeSelect: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    placeSelect: (name) => dispatch(placeSelect(name)),
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(InPage);
