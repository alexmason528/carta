import React, { Component, PropTypes } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import messages from 'containers/QuestPage/messages'
import { placeClick } from 'containers/QuestPage/actions'
import { selectPlaces } from 'containers/QuestPage/selectors'
import { Button } from 'components/Buttons'

class PlaceSection extends Component {
  static propTypes = {
    placeClick: PropTypes.func,
    places: PropTypes.array,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { search: '' }
  }

  handlePlaceClick = place => {
    const { placeClick } = this.props
    placeClick(place)
  }

  handleInputChange = evt => {
    this.setState({ search: evt.target.value })
  }

  render() {
    const { intl: { formatMessage }, places } = this.props
    const { search } = this.state

    let filteredPlaces =
      search === ''
        ? places
        : places.filter(
            place => place.name.toLowerCase().indexOf(search) !== -1
          )

    return (
      <div className="section section--place">
        <h1 className="section__title Tt-U Cr-D">
          {formatMessage(messages.inAround)}
        </h1>
        <input
          className="section__searchInput"
          value={search}
          onChange={this.handleInputChange}
        />
        <div className="section__filteredList">
          {filteredPlaces.map((place, index) => (
            <Button
              key={index}
              onClick={() => {
                this.handlePlaceClick(place)
              }}
            >
              {place.name}
            </Button>
          ))}
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  places: selectPlaces(),
})

const actions = {
  placeClick,
}

export default compose(injectIntl, connect(selectors, actions))(PlaceSection)
