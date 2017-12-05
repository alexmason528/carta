import React, { Component, PropTypes, Children } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import messages from 'containers/QuestPage/messages'
import { selectPlaces } from 'containers/QuestPage/selectors'
import { Button, StarButton } from 'components/Buttons'

class PlaceSection extends Component {
  static propTypes = {
    className: PropTypes.string,
    places: PropTypes.array,
    mapViewPortChange: PropTypes.func,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { search: '' }
  }

  handlePlaceClick = placeName => {
    this.props.mapViewPortChange(placeName)
  }

  handleInputChange = evt => {
    this.setState({ search: evt.target.value })
  }

  render() {
    const { className, intl: { formatMessage }, places } = this.props
    const { search } = this.state

    let filteredPlaces = (search === '') ? places : places.filter(place => place.name.toLowerCase().indexOf(search) !== -1)

    return (
      <div className={className}>
        <h1>{ formatMessage(messages.inAround) }</h1>
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

export default compose(
  injectIntl,
  connect(selectors),
)(PlaceSection)
