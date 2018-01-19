import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container, Row } from 'reactstrap'
import Menu from 'components/Menu'
import { ThemeTile } from 'components/Tiles'
import { selectProfile } from './selectors'
import { getProfileRequest } from './actions'
import './style.scss'

class ProfilePage extends Component {
  static propTypes = {
    getProfileRequest: PropTypes.func,
    profile: PropTypes.array,
    params: PropTypes.object,
  }
  componentWillMount() {
    const { getProfileRequest, params: { username } } = this.props
    getProfileRequest(username)
  }
  render() {
    const { profile } = this.props
    return (
      <Container fluid className="profilePage P-0 M-0">
        <Helmet meta={[{ name: 'Profile', content: 'Carta' }]} />
        <Menu currentPage="profile" />
        <Row className="profilePage__row">
          {profile &&
            profile.map((entry, index) => <ThemeTile key={index} {...entry} />)}
        </Row>
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  profile: selectProfile(),
})

const actions = {
  getProfileRequest,
}

export default connect(selectors, actions)(ProfilePage)
