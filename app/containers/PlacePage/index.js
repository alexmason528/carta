import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container, Row } from 'reactstrap'
import { PlaceTile } from 'components/Tiles'
import { selectPlaces } from './selectors'
import { getPlacesRequest } from './actions'
import './style.scss'

class PlacePage extends Component {
  static propTypes = {
    getPlacesRequest: PropTypes.func,
    places: PropTypes.array,
  }
  componentWillMount() {
    const { getPlacesRequest } = this.props
    getPlacesRequest()
  }
  render() {
    const { places } = this.props
    return (
      <Container fluid className="placePage">
        <Helmet meta={[{ name: 'Place', content: 'Carta' }]} />
        <Row className="placePage__row">{places && places.map((place, index) => <PlaceTile key={index} {...place} />)}</Row>
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  places: selectPlaces(),
})

const actions = {
  getPlacesRequest,
}

export default connect(selectors, actions)(PlacePage)
