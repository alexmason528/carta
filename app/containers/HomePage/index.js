import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { Container } from 'reactstrap'
import { compose } from 'redux'
import InfiniteScroll from 'react-infinite-scroller'
import { UPDATE_USER_SUCCESS, SIGNOUT_USER } from 'containers/App/constants'
import { selectAuthenticated, selectUser, selectInfo } from 'containers/App/selectors'
import { signOutUser, verifyUserRequest } from 'containers/App/actions'
import Verify from 'components/Verify'
import ResponsiveLayout from 'components/ResponsiveLayout'
import { S3_PROFILE_URL } from 'utils/globalConstants'
import { listPostRequest } from './actions'
import { CREATE_POST_SUCCESS, LIST_POST_REQUEST } from './constants'
import { selectPosts, selectHomeInfo, selectHasMore } from './selectors'
import { Desktop, Tablet, Mobile } from './Responsive'
import './style.scss'

class HomePage extends Component {
  static propTypes = {
    listPostRequest: PropTypes.func,
    verifyUserRequest: PropTypes.func,
    signOutUser: PropTypes.func,
    user: PropTypes.object,
    info: PropTypes.object,
    homeInfo: PropTypes.object,
    params: PropTypes.object,
    posts: PropTypes.array,
    authenticated: PropTypes.bool,
    hasMore: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      showAuthForm: false,
      showCreatePostForm: false,
      showAccountMenu: false,
      profilePic: null,
      holidayPic: null,
      timer: 0,
    }
  }

  componentWillMount() {
    const { params: { vcode }, authenticated, user } = this.props

    if (vcode && (!user || !user.verified)) {
      this.props.verifyUserRequest({ vcode })
    }

    this.setState({
      profilePic: authenticated ? user.profilePic : `${S3_PROFILE_URL}/${Math.floor(Math.random()) * 4}.jpg`,
    })
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowClick)
  }

  componentWillReceiveProps(nextProps) {
    const { authenticated } = this.props
    const { homeInfo, info: { status } } = nextProps

    if (homeInfo.status === CREATE_POST_SUCCESS) {
      this.setState({ showCreatePostForm: false })
    }

    if ((!authenticated && nextProps.authenticated) || status === UPDATE_USER_SUCCESS) {
      const { profilePic } = nextProps.user
      this.setState({ profilePic })
    } else if (status === SIGNOUT_USER) {
      this.setState({
        profilePic: `${S3_PROFILE_URL}/${Math.floor(Math.random()) * 4}.jpg`,
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick)
  }

  handleWindowClick = () => {
    this.setState({
      showAccountMenu: false,
      showAuthForm: false,
    })
  }

  handleProfileClick = evt => {
    const { authenticated } = this.props
    if (!authenticated) {
      evt.stopPropagation()
      this.setState({ showAuthForm: !this.state.showAuthForm })
    } else {
      this.setState({ showAccountMenu: !this.state.showAccountMenu })
    }
  }

  handleToggleCreatePostForm = () => {
    this.setState({ showCreatePostForm: !this.state.showCreatePostForm })
  }

  handleProfilePic = (evt, newVal) => {
    this.setState({ profilePic: newVal })
  }

  handleHolidayPic = (evt, newVal) => {
    this.setState({ holidayPic: newVal })
  }

  handleLoadMore = () => {
    const { homeInfo: { status }, listPostRequest } = this.props
    if (status !== LIST_POST_REQUEST) {
      listPostRequest()
    }
  }

  render() {
    const { showAuthForm, showCreatePostForm, showAccountMenu, profilePic, holidayPic } = this.state
    const { user, hasMore, signOutUser, info: { status } } = this.props
    const viewData = {
      profilePic,
      holidayPic,
      showAuthForm,
      showCreatePostForm,
      showAccountMenu,
      profileClick: this.handleProfileClick,
      profilePicClick: this.handleProfilePic,
      holidayPicClick: this.handleHolidayPic,
      toggleCreatePostForm: this.handleToggleCreatePostForm,
    }

    return (
      <Container fluid className="homePage P-0 M-0">
        <Helmet meta={[{ name: 'description', content: 'Carta' }]} />
        <InfiniteScroll loadMore={this.handleLoadMore} hasMore={hasMore} threshold={1000}>
          <ResponsiveLayout desktop={<Desktop {...viewData} />} tablet={<Tablet {...viewData} />} mobile={<Mobile {...viewData} />} />
        </InfiniteScroll>
        <Verify user={user} status={status} signOutUser={signOutUser} />
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  authenticated: selectAuthenticated(),
  homeInfo: selectHomeInfo(),
  posts: selectPosts(),
  user: selectUser(),
  info: selectInfo(),
  hasMore: selectHasMore(),
})

const actions = {
  listPostRequest,
  verifyUserRequest,
  signOutUser,
}

export default compose(injectIntl, connect(selectors, actions))(HomePage)
