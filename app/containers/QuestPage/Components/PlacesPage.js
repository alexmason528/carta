import React, { Component, PropTypes, Children } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Button, StarButton } from './Buttons'
import { fetchRecommendations, placeSelect } from '../actions'
import { selectPlaces } from '../selectors'

import '../style.scss'

class PlacesPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      places: [],
      search: '',
    }
  }

  componentWillMount() {
    this.initializeState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.initializeState(nextProps)
  }

  componentDidUpdate(prevProps, prevState) {
    setTimeout(() => {
      this.searchInput.focus()
    }, 500)
  }

  initializeState = props => {
    this.setState({
      places: props.places,
    })
  }

  placeClicked = placeName => {
    this.props.mapViewPortChange(placeName)
  }

  inputChangeHandler = text => {
    this.setState({
      search: text,
    })
  }

  render() {
    const { places, search } = this.state

    let filteredPlaces
    if (search === '') filteredPlaces = places
    else filteredPlaces = places.filter(place => place.name.toLowerCase().indexOf(search) !== -1)

    return (
      <div className={this.props.className}>
        <h1>In & around</h1>
        <input ref={input => { this.searchInput = input }} className="search-input place-search" onChange={evt => { this.inputChangeHandler(evt.target.value) }} />
        <div className="buttons-row">
          { filteredPlaces.map((place, index) => <button className="place-button" key={index} onClick={() => { this.placeClicked(place.name) }}>{place.name}</button>) }
        </div>
      </div>
    )
  }
}

PlacesPage.propTypes = {
  className: PropTypes.string,
  places: PropTypes.array,
  questIndex: PropTypes.number,
  mapViewPortChange: PropTypes.func,
  fetchRecommendations: PropTypes.func,
}

const mapStateToProps = createStructuredSelector({
  places: selectPlaces(),
})

const mapDispatchToProps = dispatch => {
  return {
    fetchRecommendations: () => dispatch(fetchRecommendations()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacesPage)
