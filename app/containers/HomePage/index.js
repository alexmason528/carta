import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { Container, Col } from 'reactstrap'
import { compose } from 'redux'
import Masonry from 'react-masonry-component'
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
import {
  signOut,
  verifyRequest,
  updateUserRequest,
} from 'containers/App/actions'
import { CREATE_POST_SUCCESS } from 'containers/HomePage/constants'
import { CreatePostButton } from 'components/Buttons'
import AccountMenu from 'components/AccountMenu'
import AuthForm from 'components/AuthForm'
import Menu from 'components/Menu'
import Verify from 'components/Verify'
import { Post, PostCreate } from 'components/Post'
import Profile from 'components/Profile'
import FixedTile from 'components/FixedTile'
import { getFirstname } from 'utils/stringHelper'
import { selectPosts, selectHomeInfo, selectEditingPost } from './selectors'
import { listPostRequest } from './actions'
import messages from './messages'
import './style.scss'

class HomePage extends Component {
  static propTypes = {
    listPostRequest: PropTypes.func,
    updateUserRequest: PropTypes.func,
    verifyRequest: PropTypes.func,
    signOut: PropTypes.func,
    user: PropTypes.object,
    info: PropTypes.object,
    homeInfo: PropTypes.object,
    params: PropTypes.object,
    editingPost: PropTypes.object,
    posts: PropTypes.array,
    authenticated: PropTypes.bool,
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
    this.props.listPostRequest()

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

  toggleCreatePostForm = () => {
    this.setState({ showCreatePostForm: !this.state.showCreatePostForm })
  }

  handleProfilePic = (evt, newVal) => {
    this.setState({ profilePic: newVal })
  }

  render() {
    const {
      showAuthForm,
      showCreatePostForm,
      showAccountMenu,
      profilePic,
    } = this.state

    const {
      posts,
      authenticated,
      user,
      signOut,
      updateUserRequest,
      info,
      intl: { locale, formatMessage },
      editingPost,
    } = this.props
    const { status } = info
    const filteredPosts = posts.filter(post => post.title[locale] !== '')
    const createPostButtonType =
      filteredPosts.length > 0 && filteredPosts[0].img ? 'image' : 'text'

    return (
      <Container fluid className="homePage P-0 M-0 Ov-XH">
        <Helmet meta={[{ name: 'description', content: 'Carta' }]} />
        <Menu currentPage="home" />
        <Masonry
          className="homePage__row"
          options={{
            gutter: 0,
            horizontalOrder: true,
          }}
          enableResizableChildren
        >
          <Col xs={12} sm={6} md={4} className="homePage__col">
            <Profile
              onClick={this.handleProfileClick}
              onUpdate={updateUserRequest}
              authenticated={authenticated}
              profilePic={profilePic}
              user={user}
              info={info}
            />
            {authenticated ? (
              <AccountMenu
                show={showAccountMenu}
                onClick={this.handleProfileClick}
              />
            ) : (
              <AuthForm
                show={showAuthForm}
                onProfilePicChange={this.handleProfilePic}
                profilePic={profilePic}
              />
            )}
          </Col>
          <Col xs={12} sm={6} md={4} className="homePage__col">
            <FixedTile
              img="quest.jpg"
              link="/quest"
              title={formatMessage(messages.startQuest).replace(/\n/g, '<br/>')}
              message="Start a new quest"
              authenticated={authenticated}
            />
          </Col>
          <Col xs={12} sm={6} md={4} className="homePage__col themeTile">
            <FixedTile
              img="theme.jpg"
              link="/quest"
              title={'Thema<br/>Highlight'}
              message="Browse new themes"
              authenticated={authenticated}
            />
          </Col>
          {filteredPosts &&
            filteredPosts.map((post, key) => {
              const data = {
                ...post,
                firstname: getFirstname(post.author.fullname),
                editable:
                  authenticated &&
                  (post.author._id === user._id || user.role === 'admin') &&
                  !editingPost &&
                  !showCreatePostForm,
                first: key === 0 && authenticated,
              }
              return (
                <Col key={key} xs={12} sm={6} md={4} className="homePage__col">
                  <Post {...data} />
                </Col>
              )
            })}
        </Masonry>
        <Verify user={user} status={status} signOut={signOut} />
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  editingPost: selectEditingPost(),
  posts: selectPosts(),
  authenticated: selectAuthenticated(),
  user: selectUser(),
  info: selectInfo(),
  homeInfo: selectHomeInfo(),
})

const actions = {
  listPostRequest,
  updateUserRequest,
  verifyRequest,
  signOut,
}

export default compose(injectIntl, connect(selectors, actions))(HomePage)
