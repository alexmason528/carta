import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container, Row } from 'reactstrap'
import { ThemeTile } from 'components/Tiles'
import { selectThemes } from './selectors'
import { getThemesRequest } from './actions'
import './style.scss'

class ThemePage extends Component {
  static propTypes = {
    getThemesRequest: PropTypes.func,
    themes: PropTypes.array,
  }
  componentWillMount() {
    const { getThemesRequest } = this.props
    getThemesRequest()
  }
  render() {
    const { themes } = this.props
    return (
      <Container fluid className="themePage P-0 M-0">
        <Helmet meta={[{ name: 'Theme', content: 'Carta' }]} />
        <Row className="themePage__row">{themes && themes.map((theme, index) => <ThemeTile key={index} {...theme} />)}</Row>
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  themes: selectThemes(),
})

const actions = {
  getThemesRequest,
}

export default connect(selectors, actions)(ThemePage)
