import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container, Row } from 'reactstrap'
import Menu from 'components/Menu'
import { FriendTile } from 'components/Tiles'
import { selectFriends } from './selectors'
import { getFriendsRequest } from './actions'
import './style.scss'

class FriendsPage extends Component {
  static propTypes = {
    getFriendsRequest: PropTypes.func,
    friends: PropTypes.array,
    params: PropTypes.object,
  }
  componentWillMount() {
    const { getFriendsRequest, params: { username } } = this.props
    getFriendsRequest(username)
  }
  render() {
    const { friends } = this.props

    return (
      <Container fluid className="friendsPage P-0 M-0">
        <Helmet meta={[{ name: 'Friends', content: 'Carta' }]} />
        <Menu currentPage="friends" />
        <Row className="friendsPage__row">
          {friends &&
            friends.map((entry, index) => (
              <FriendTile key={index} {...entry} />
            ))}
        </Row>
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  friends: selectFriends(),
})

const actions = {
  getFriendsRequest,
}

export default connect(selectors, actions)(FriendsPage)
