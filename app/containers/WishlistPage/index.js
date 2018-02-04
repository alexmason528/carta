import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container, Row } from 'reactstrap'
import { getUserWishlistRequest, deleteUserWishlistRequest } from 'containers/App/actions'
import { selectUser, selectUserWishlist } from 'containers/App/selectors'
import { WishlistTile } from 'components/Tiles'
import { selectWishlist } from './selectors'
import { getWishlistRequest } from './actions'
import './style.scss'

class WishlistPage extends Component {
  static propTypes = {
    getWishlistRequest: PropTypes.func,
    getUserWishlistRequest: PropTypes.func,
    deleteUserWishlistRequest: PropTypes.func,
    params: PropTypes.object,
    user: PropTypes.object,
    wishlist: PropTypes.array,
    userWishlist: PropTypes.array,
  }

  constructor(props) {
    super(props)

    this.state = { deletingWishlist: null }
  }

  componentWillMount() {
    const { params: { username }, user } = this.props
    if (!user || username !== user.username) {
      this.props.getWishlistRequest(username)
    } else {
      this.props.getUserWishlistRequest(username)
    }
  }

  handleDelete = brochureID => {
    const { deleteUserWishlistRequest, user } = this.props
    this.setState({ deletingWishlist: brochureID }, () => {
      deleteUserWishlistRequest({ userID: user._id, brochureID })
    })
  }

  render() {
    const { deletingWishlist } = this.state
    const { wishlist, userWishlist, user, params: { username } } = this.props

    let showList
    let canDelete

    if (!user || username !== user.username) {
      showList = wishlist
      canDelete = false
    } else {
      showList = userWishlist
      canDelete = true
    }

    return (
      <Container fluid className="wishlistPage">
        <Helmet meta={[{ name: 'Wishlist', content: 'Carta' }]} />
        <Row className="wishlistPage__row">
          {showList &&
            showList.map((entry, index) => (
              <WishlistTile key={index} {...entry} canDelete={canDelete} deleting={entry.brochureID === deletingWishlist} onDelete={this.handleDelete} />
            ))}
        </Row>
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  user: selectUser(),
  userWishlist: selectUserWishlist(),
  wishlist: selectWishlist(),
})

const actions = {
  getWishlistRequest,
  getUserWishlistRequest,
  deleteUserWishlistRequest,
}

export default connect(selectors, actions)(WishlistPage)
