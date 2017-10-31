import React, { Component, PropTypes, Children } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { fetchRecommendations, placeSelect } from 'containers/QuestPage/actions'
import { selectPlaces } from 'containers/QuestPage/selectors'
import { Button, StarButton } from '../Buttons'

class PlaceSection extends Component {
  static propTypes = {
    className: PropTypes.string,
    places: PropTypes.array,
    questIndex: PropTypes.number,
    mapViewPortChange: PropTypes.func,
    fetchRecommendations: PropTypes.func,
  }

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

  initializeState = props => {
    this.setState({
      places: props.places,
    })
  }

  handlePlaceClick = placeName => {
    const { mapViewPortChange } = this.props
    mapViewPortChange(placeName)
  }

  handleInputChange = evt => {
    this.setState({
      search: evt.target.value,
    })
  }

  render() {
    const { places, search } = this.state
    const { className } = this.props

    let filteredPlaces
    if (search === '') filteredPlaces = places
    else filteredPlaces = places.filter(place => place.name.toLowerCase().indexOf(search) !== -1)

    return (
      <div className={className}>
        <h1>In & around</h1>
        <input className="search-input place-search" onChange={this.handleInputChange} />
        <div className="buttons-row">
          { filteredPlaces.map((place, index) => <button className="place-button" key={index} onClick={() => { this.handlePlaceClick(place.name) }}>{place.name}</button>) }
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  places: selectPlaces(),
})

const actions = {
  fetchRecommendations,
}

export default connect(selectors, actions)(PlaceSection)
