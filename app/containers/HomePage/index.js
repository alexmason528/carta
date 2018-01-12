import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { Container } from 'reactstrap'
import { compose } from 'redux'
import InfiniteScroll from 'react-infinite-scroller'
import {
  CLOUDINARY_PROFILE_URL,
  UPDATE_USER_SUCCESS,
  SIGNOUT,
} from 'containers/App/constants'
import {
  selectAuthenticated,
  selectUser,
  selectInfo,
} from 'containers/App/selectors'
import { signOut, verifyRequest } from 'containers/App/actions'
import Menu from 'components/Menu'
import Verify from 'components/Verify'
import ResponsiveLayout from 'components/ResponsiveLayout'
import { Desktop, Tablet, Mobile } from 'components/HomePageViews'
import { listPostRequest } from './actions'
import { CREATE_POST_SUCCESS, LIST_POST_REQUEST } from './constants'
import { selectPosts, selectHomeInfo, selectHasMore } from './selectors'
import './style.scss'

class HomePage extends Component {
  static propTypes = {
    listPostRequest: PropTypes.func,
    verifyRequest: PropTypes.func,
    signOut: PropTypes.func,
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
      timer: 0,
    }
  }

  componentWillMount() {
    const { params: { vcode }, authenticated, user } = this.props

    if (vcode && (!user || !user.verified)) {
      this.props.verifyRequest({ vcode })
    }

    this.setState({
      profilePic: authenticated
        ? user.profilePic
        : `${CLOUDINARY_PROFILE_URL}/${Math.floor(Math.random()) * 4}.jpg`,
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

    if (
      (!authenticated && nextProps.authenticated) ||
      status === UPDATE_USER_SUCCESS
    ) {
      const { profilePic } = nextProps.user
      this.setState({ profilePic })
    } else if (status === SIGNOUT) {
      this.setState({
        profilePic: `${CLOUDINARY_PROFILE_URL}/${Math.floor(Math.random()) *
          4}.jpg`,
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

  handleLoadMore = () => {
    const { homeInfo: { status }, listPostRequest } = this.props
    if (status !== LIST_POST_REQUEST) {
      listPostRequest()
    }
  }

  render() {
    const {
      showAuthForm,
      showCreatePostForm,
      showAccountMenu,
      profilePic,
    } = this.state

    // const { posts, user, signOut, info, intl: { locale }, hasMore } = this.props
    // const filteredPosts = posts.filter(post => post.title[locale] !== '')
    // const createPostButtonType =
    //   filteredPosts.length > 0 && filteredPosts[0].img ? 'image' : 'text'
    const { user, signOut, info: { status }, hasMore } = this.props

    return (
      <Container fluid className="homePage P-0 M-0">
        <Helmet meta={[{ name: 'description', content: 'Carta' }]} />
        <Menu currentPage="home" />
        <InfiniteScroll
          loadMore={this.handleLoadMore}
          hasMore={hasMore}
          threshold={500}
        >
          <ResponsiveLayout
            desktop={
              <Desktop
                profilePic={profilePic}
                profileClick={this.handleProfileClick}
                profilePicClick={this.handleProfilePic}
                showAuthForm={showAuthForm}
                showCreatePostForm={showCreatePostForm}
                showAccountMenu={showAccountMenu}
                toggleCreatePostForm={this.handleToggleCreatePostForm}
              />
            }
            tablet={
              <Tablet
                profilePic={profilePic}
                profileClick={this.handleProfileClick}
                profilePicClick={this.handleProfilePic}
                showAuthForm={showAuthForm}
                showCreatePostForm={showCreatePostForm}
                showAccountMenu={showAccountMenu}
                toggleCreatePostForm={this.handleToggleCreatePostForm}
              />
            }
            mobile={
              <Mobile
                profilePic={profilePic}
                profileClick={this.handleProfileClick}
                profilePicClick={this.handleProfilePic}
                showAuthForm={showAuthForm}
                showCreatePostForm={showCreatePostForm}
                showAccountMenu={showAccountMenu}
                toggleCreatePostForm={this.handleToggleCreatePostForm}
              />
            }
          />
        </InfiniteScroll>
        <Verify user={user} status={status} signOut={signOut} />
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
  verifyRequest,
  signOut,
}

export default compose(injectIntl, connect(selectors, actions))(HomePage)
