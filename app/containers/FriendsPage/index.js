import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container, Row } from 'reactstrap'
import { selectUser } from 'containers/App/selectors'
import { FriendTile, HolidayTile } from 'components/Tiles'
import { selectFriends, selectFullname, selectHolidayPic } from './selectors'
import { getFriendsRequest, updateHolidayPicRequest } from './actions'
import './style.scss'

class FriendsPage extends Component {
  static propTypes = {
    getFriendsRequest: PropTypes.func,
    updateHolidayPicRequest: PropTypes.func,
    params: PropTypes.object,
    user: PropTypes.object,
    friends: PropTypes.array,
    fullname: PropTypes.string,
    holidayPic: PropTypes.string,
  }
  componentWillMount() {
    const { params: { username } } = this.props
    this.props.getFriendsRequest(username)
  }
  render() {
    const { friends, fullname, user, params: { username } } = this.props
    const canUpdate = user && user.username === username

    let holidayPic

    if (this.props.holidayPic) {
      holidayPic = this.props.holidayPic
    } else if (canUpdate) {
      holidayPic = user.holidayPic
    }

    return (
      <Container fluid className="friendsPage">
        <Helmet meta={[{ name: 'Friends', content: 'Carta' }]} />
        <Row className="friendsPage__row">
          <HolidayTile fullname={fullname} holidayPic={holidayPic} canUpdate={canUpdate} updateHolidayPic={this.props.updateHolidayPicRequest} />
          {friends && friends.map((entry, index) => <FriendTile key={index} {...entry} />)}
        </Row>
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  user: selectUser(),
  friends: selectFriends(),
  fullname: selectFullname(),
  holidayPic: selectHolidayPic(),
})

const actions = {
  getFriendsRequest,
  updateHolidayPicRequest,
}

export default connect(selectors, actions)(FriendsPage)
