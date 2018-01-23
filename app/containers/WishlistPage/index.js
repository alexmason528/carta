import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container, Row } from 'reactstrap'
import { selectUser } from 'containers/App/selectors'
import { WishlistTile } from 'components/Tiles'
import { selectWishlist } from './selectors'
import { getWishlistRequest, deleteWishlistRequest } from './actions'
import './style.scss'

class WishlistPage extends Component {
  static propTypes = {
    getWishlistRequest: PropTypes.func,
    deleteWishlistRequest: PropTypes.func,
    params: PropTypes.object,
    user: PropTypes.object,
    wishlist: PropTypes.array,
  }

  constructor(props) {
    super(props)

    this.state = {
      deletingWishlist: null,
    }
  }

  componentWillMount() {
    const { params: { username } } = this.props
    this.props.getWishlistRequest(username)
  }

  handleDelete = id => {
    const { deleteWishlistRequest } = this.props
    this.setState({ deletingWishlist: id }, () => {
      deleteWishlistRequest(id)
    })
  }

  render() {
    const { deletingWishlist } = this.state
    const { wishlist, user, params } = this.props
    let canDelete = true

    if (!user || user.username !== params.username) {
      canDelete = false
    }
    return (
      <Container fluid className="wishlistPage P-0 M-0">
        <Helmet meta={[{ name: 'Wishlist', content: 'Carta' }]} />
        <Row className="wishlistPage__row">
          {wishlist &&
            wishlist.map((entry, index) => (
              <WishlistTile key={index} {...entry} canDelete={canDelete} deleting={entry.id === deletingWishlist} onDelete={this.handleDelete} />
            ))}
        </Row>
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  user: selectUser(),
  wishlist: selectWishlist(),
})

const actions = {
  getWishlistRequest,
  deleteWishlistRequest,
}

export default connect(selectors, actions)(WishlistPage)
