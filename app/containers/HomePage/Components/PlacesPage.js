import React, { PropTypes, Children } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Button, StarButton } from './Buttons';
import { fetchRecommendations, placeSelect } from '../actions';

import './style.scss';

export class PlacesPage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      places: [],
      search: '',
    };
  }

  componentWillMount() {
    this.initializeState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initializeState(nextProps);
  }

  componentDidUpdate(prevProps, prevState) {
    setTimeout(() => {
      this.searchInput.focus();
    }, 500);
  }

  initializeState(props) {
    this.setState({
      places: props.places,
    });
  }

  placeClicked = (placeName) => {
    this.props.mapViewPortChange(placeName);
    this.props.fetchRecommendations();
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
        <h1>In & around</h1>
        <input ref={(input) => { this.searchInput = input; }} className="search-input place-search" onChange={(evt) => { this.inputChangeHandler(evt.target.value); }} />
        <div className="buttons-row">
          { filteredPlaces.map((place, index) => <button className="place-button" key={index} onClick={() => { this.placeClicked(place.name); }}>{place.name}</button>) }
        </div>
      </div>
    );
  }
}

PlacesPage.propTypes = {
  className: PropTypes.string,
  places: PropTypes.array,
  questIndex: PropTypes.number,
  placeSelect: PropTypes.func,
  mapViewPortChange: PropTypes.func,
  fetchRecommendations: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    placeSelect: (name, questIndex) => dispatch(placeSelect(name, questIndex)),
    fetchRecommendations: () => dispatch(fetchRecommendations()),
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(PlacesPage);
