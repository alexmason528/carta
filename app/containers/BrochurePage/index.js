import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Container, Row, Col } from 'reactstrap'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import cx from 'classnames'
import { find } from 'lodash'
import { getUserWishlistRequest, createUserWishlistRequest, deleteUserWishlistRequest } from 'containers/App/actions'
import { CREATE_USER_WISHLIST_SUCCESS, DELETE_USER_WISHLIST_SUCCESS } from 'containers/App/constants'
import { selectAuthenticated, selectUserWishlist, selectUser, selectInfo } from 'containers/App/selectors'
import Img from 'components/Img'
import ResponsiveLayout from 'components/ResponsiveLayout'
import { ImageTile, TextTile, TextTileMobile } from 'components/Tiles'
import { S3_ICON_URL } from 'utils/globalConstants'
import { getBrochureRequest } from './actions'
import { selectBrochureDetail } from './selectors'
import messages from './messages'
import './style.scss'

class BrochurePage extends Component {
  static propTypes = {
    getBrochureRequest: PropTypes.func,
    getUserWishlistRequest: PropTypes.func,
    createUserWishlistRequest: PropTypes.func,
    deleteUserWishlistRequest: PropTypes.func,
    params: PropTypes.object,
    router: PropTypes.object,
    location: PropTypes.object,
    info: PropTypes.object,
    user: PropTypes.object,
    brochureDetail: PropTypes.object,
    authenticated: PropTypes.bool,
    wishlist: PropTypes.array,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      message: null,
      show: false,
    }
  }

  componentWillMount() {
    const { authenticated, getUserWishlistRequest, getBrochureRequest, params: { link } } = this.props
    if (authenticated) {
      getUserWishlistRequest()
    }
    getBrochureRequest(link)
  }

  componentWillReceiveProps(nextProps) {
    const { info: { status } } = nextProps
    if (status === CREATE_USER_WISHLIST_SUCCESS) {
      this.showMessage(messages.addedToWishlist)
    } else if (status === DELETE_USER_WISHLIST_SUCCESS) {
      this.showMessage(messages.removedFromWishlist)
    }
  }

  showMessage = message => {
    const { intl: { formatMessage } } = this.props
    this.setState({ message: formatMessage(message), show: true }, () => {
      setTimeout(() => {
        this.setState({ show: false })
      }, 3000)
    })
  }

  handleBrochureClose = () => {
    const { router } = this.props
    router.push('/quest')
  }

  handleBrochureAddtoWishlist = alreadyExist => {
    const { authenticated, user, brochureDetail: { _id, e }, location: { pathname }, createUserWishlistRequest, deleteUserWishlistRequest } = this.props
    if (!authenticated) {
      this.showMessage(messages.createWishlist)
    } else if (alreadyExist) {
      deleteUserWishlistRequest({ userID: user._id, brochureID: _id })
    } else {
      createUserWishlistRequest({ userID: user._id, brochureID: _id, quest: pathname, e })
    }
  }

  handleClickMessage = () => {
    const { authenticated, user, router } = this.props

    if (!authenticated) {
      router.push('/')
    } else {
      router.push(`/user/${user.username}/wishlist`)
    }
  }

  render() {
    const { message, show } = this.state
    const { brochureDetail, authenticated, user, wishlist } = this.props

    if (!brochureDetail) return null

    const { info: { mainPoster, description, tiles }, _id } = brochureDetail

    let alreadyExist = false

    if (!authenticated || !find(wishlist, { userID: user._id, brochureID: _id })) {
      alreadyExist = false
    } else {
      alreadyExist = true
    }

    return (
      <Container fluid className="brochure P-0 M-0">
        <div className="brochure__menu">
          <h2 className={cx({ brochure__message: true, 'brochure__message--hidden': !show })} onClick={this.handleClickMessage}>
            {message}
          </h2>
          <button
            onClick={() => {
              this.handleBrochureAddtoWishlist(alreadyExist)
            }}
          >
            <Img src={alreadyExist ? `${S3_ICON_URL}/star-red.png` : `${S3_ICON_URL}/star-stroke.png`} />
          </button>
          <button onClick={this.handleBrochureClose}>
            <Img src={`${S3_ICON_URL}/close.png`} />
          </button>
        </div>
        <Row className="brochure__row">
          {mainPoster && (
            <Col lg={8} md={12} sm={12} xs={12} className="brochure__col">
              <ImageTile type="main" img={mainPoster.url} title={mainPoster.title} />
            </Col>
          )}
          {description && (
            <Col lg={4} md={12} sm={12} xs={12} className="brochure__col">
              <Row className="brochure__row">
                <Col lg={12} md={6} sm={12} xs={12} className="brochure__col">
                  <ResponsiveLayout
                    desktop={<TextTile type="description" title={''} content={description.text.content} />}
                    tablet={<TextTile type="description" title={''} content={description.text.content} />}
                    mobile={<TextTileMobile type="description" title={''} content={description.text.content} />}
                  />
                </Col>
                <Col lg={12} md={6} sm={12} xs={12} className="brochure__col">
                  <ImageTile type="description" img={description.poster.url} title={description.poster.title} />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
        <Row className="brochure__row">
          {tiles &&
            tiles.map((tile, index) => {
              const { content, title, type, url } = tile
              return type === 'text' ? (
                <ResponsiveLayout
                  key={index}
                  desktop={<TextTile title={title} content={content} />}
                  tablet={<TextTile title={title} content={content} />}
                  mobile={<TextTileMobile title={title} content={content} />}
                />
              ) : (
                <ImageTile img={url} title={title} key={index} />
              )
            })}
        </Row>
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  info: selectInfo(),
  user: selectUser(),
  wishlist: selectUserWishlist(),
  authenticated: selectAuthenticated(),
  brochureDetail: selectBrochureDetail(),
})

const actions = {
  getUserWishlistRequest,
  createUserWishlistRequest,
  deleteUserWishlistRequest,
  getBrochureRequest,
}

export default compose(withRouter, injectIntl, connect(selectors, actions))(BrochurePage)
