import React, { Component, PropTypes, Children } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { placeSelect } from 'containers/QuestPage/actions'
import messages from 'containers/QuestPage/messages'
import { selectPlaces } from 'containers/QuestPage/selectors'
import { Button, StarButton } from 'components/Buttons'

class PlaceSection extends Component {
  static propTypes = {
    className: PropTypes.string,
    places: PropTypes.array,
    questIndex: PropTypes.number,
    mapViewPortChange: PropTypes.func,
    intl: intlShape.isRequired,
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
    const { places } = props
    this.setState({ places })
  }

  handlePlaceClick = placeName => {
    this.props.mapViewPortChange(placeName)
  }

  handleInputChange = evt => {
    this.setState({ search: evt.target.value })
  }

  render() {
    const { places, search } = this.state
    const { className, intl: { formatMessage } } = this.props

    let filteredPlaces = (search === '') ? places : places.filter(place => place.name.toLowerCase().indexOf(search) !== -1)

    return (
      <div className={className}>
        <h1>{ formatMessage(messages.inaround) }</h1>
        <input className="search-input place-search" value={search} onChange={this.handleInputChange} />
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

export default injectIntl(connect(selectors)(PlaceSection))
