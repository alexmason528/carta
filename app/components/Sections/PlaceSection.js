import React, { Component, PropTypes } from 'react'
import { compose } from 'redux'
import { injectIntl, intlShape } from 'react-intl'
import { withRouter, browserHistory } from 'react-router'
import messages from 'containers/QuestPage/messages'
import { Button } from 'components/Buttons'
import { urlComposer } from 'utils/urlHelper'

class PlaceSection extends Component {
  static propTypes = {
    places: PropTypes.array,
    params: PropTypes.object,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { search: '' }
  }

  componentDidMount() {
    this.handleAutoFocus()
  }

  componentDidUpdate() {
    this.handleAutoFocus()
  }

  handleAutoFocus() {
    if (window.innerWidth >= 768) {
      setTimeout(() => {
        if (this.refs.searchInput) {
          this.refs.searchInput.focus()
        }
      }, 0)
    }
  }

  handlePlaceClick = place => {
    const { params } = this.props
    const { center: { lng, lat }, zoom } = place
    const url = urlComposer({ params: JSON.parse(JSON.stringify(params)), change: 'viewport', value: `${lng},${lat},${zoom}` })
    browserHistory.push(url)
  }

  handleInputChange = evt => {
    this.setState({ search: evt.target.value })
  }

  render() {
    const { intl: { formatMessage }, places } = this.props
    const { search } = this.state
    const isDesktop = window.innerWidth >= 768

    let filteredPlaces = search === '' ? places : places.filter(place => place.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)

    return (
      <div className="section section--place">
        <h1 className="section__title">{formatMessage(messages.inAround)}</h1>
        <input className="section__searchInput" value={search} placeholder={isDesktop ? '' : 'Search'} ref="searchInput" onChange={this.handleInputChange} />
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
export default compose(injectIntl, withRouter)(PlaceSection)
