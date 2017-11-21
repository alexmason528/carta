import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import className from 'classnames'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container, Row, Col } from 'reactstrap'
import { UPDATE_USER_SUCCESS, VERIFY_FAIL, CLOUDINARY_COVER_URL, CLOUDINARY_PROFILE_URL, SIGNOUT } from 'containers/App/constants'
import { selectAuthenticated, selectUser, selectInfo } from 'containers/App/selectors'
import { signOut, verifyRequest, updateUserRequest } from 'containers/App/actions'
import { CREATE_POST_SUCCESS } from 'containers/HomePage/constants'
import { CreatePostButton } from 'components/Buttons'
import AccountMenu from 'components/AccountMenu'
import AuthForm from 'components/AuthForm'
import Menu from 'components/Menu'
import { Post, PostCreate } from 'components/Post'
import Profile from 'components/Profile'
import StartQuest from 'components/StartQuest'
import { getCroppedImage, getCoverProfilePic } from 'utils/imageHelper'
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
      coverPic: null,
      profilePic: null,
      timer: 0,
    }
  }

  componentWillMount() {
    const { listPostRequest, verifyRequest, params: { vcode }, authenticated, user } = this.props

    if (vcode) { verifyRequest({ vcode }) }
    listPostRequest()

    if (authenticated) {
      const { coverPic, profilePic } = user
      this.setState({ coverPic, profilePic })
    } else {
      const { coverPic, profilePic } = getCoverProfilePic()
      this.setState({ coverPic, profilePic })
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowClick)
  }

  componentWillReceiveProps(nextProps) {
    const { authenticated, user, params: { vcode } } = this.props
    const { homeInfo, info: { status } } = nextProps

    if (status === CREATE_POST_SUCCESS) {
      this.setState({ showCreatePostForm: false })
    }

    if ((!user && vcode && nextProps.user && nextProps.user.verified === true) || (user && nextProps.user && user.verified === false && nextProps.user.verified === true)) {
      this.setState({
        timer: 5,
      }, () => {
        setInterval(() => {
          const { timer } = this.state
          if (timer !== 0) {
            this.setState({ timer: timer - 1 })
          } else {
            browserHistory.push('/')
          }
        }, 1000)
      })
    }

    if ((!authenticated && nextProps.authenticated) || (status === UPDATE_USER_SUCCESS)) {
      const { coverPic, profilePic } = nextProps.user
      this.setState({ coverPic, profilePic })
    } else if (status === SIGNOUT) {
      const { coverPic, profilePic } = getCoverProfilePic()
      this.setState({ coverPic, profilePic })
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

  handleProfilePic = (evt, newVal, prevVal) => {
    this.setState({ profilePic: newVal })
  }

  handleCoverPic = (evt, newVal, prevVal) => {
    this.setState({ coverPic: newVal })
  }

  render() {
    const { showAuthForm, showCreatePostForm, showAccountMenu, timer, coverPic, profilePic } = this.state
    const { posts, authenticated, user, signOut, updateUserRequest, info, intl: { formatMessage }, editingPost } = this.props
    const { status, error } = info

    let createPostButtonType = 'text'

    if (posts.length > 0 && posts[0].img) {
      createPostButtonType = 'image'
    }

    return (
      <Container fluid className="homepage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <Menu currentPage="Home" />
        <Row className="homepage__row">
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col">
            <Profile
              onClick={this.handleProfileClick}
              onUpdate={updateUserRequest}
              authenticated={authenticated}
              user={user}
              info={info}
              coverPic={coverPic}
              profilePic={profilePic}
            />
            { authenticated ?
              <AccountMenu show={showAccountMenu} onClick={this.handleProfileClick} /> :
              <AuthForm
                show={showAuthForm}
                onCoverPicChange={this.handleCoverPic}
                onProfilePicChange={this.handleProfilePic}
                coverPic={coverPic}
                profilePic={profilePic}
              />
            }
            <StartQuest authenticated={authenticated} />
            {
              posts && posts.map((post, key) => {
                const { _id, content, created_at, img, title, link } = post

                let data = {
                  _id,
                  created_at,
                  title,
                  key,
                  link: link !== null ? link : '',
                  content: content.length === 0 ? null : content,
                  img: img.length === 0 ? null : img,
                  firstname: getFirstname(post.author.fullname),
                  editable: (authenticated && (post.author._id === user._id || user.role === 'admin')) && !editingPost && !showCreatePostForm,
                  first: (key === 0 && authenticated),
                }

                return (key === 6 || key === 8) ? <Post {...data} /> : null
              })
            }
          </Col>

          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col">
            { authenticated && !showCreatePostForm && user.verified && !editingPost && <CreatePostButton type={createPostButtonType} onClick={this.toggleCreatePostForm} />}
            { authenticated && showCreatePostForm && <PostCreate onClose={this.toggleCreatePostForm} user={user} /> }
            <div>
              {
                posts && posts.map((post, key) => {
                  const { _id, content, created_at, img, title, link } = post

                  let data = {
                    _id,
                    created_at,
                    title,
                    key,
                    link: link !== null ? link : '',
                    content: content.length === 0 ? null : content,
                    img: img.length === 0 ? null : img,
                    firstname: getFirstname(post.author.fullname),
                    editable: (authenticated && (post.author._id === user._id || user.role === 'admin')) && !editingPost && !showCreatePostForm,
                    first: (key === 0 && authenticated),
                  }

                  return (key === 0 || key === 1 || key === 4 || key === 7) ? <Post {...data} /> : null
                })
              }
            </div>
          </Col>
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col">
            {
              posts && posts.map((post, key) => {
                const { _id, content, created_at, img, title, link } = post

                let data = {
                  _id,
                  created_at,
                  title,
                  key,
                  link: link !== null ? link : '',
                  content: content.length === 0 ? null : content,
                  img: img.length === 0 ? null : img,
                  firstname: getFirstname(post.author.fullname),
                  editable: (authenticated && (post.author._id === user._id || user.role === 'admin')) && !editingPost && !showCreatePostForm,
                  first: (key === 0 && authenticated),
                }

                return (key === 2 || key === 3 || key === 5) ? <Post {...data} /> : null
              })
            }
          </Col>
        </Row>
        { user && !user.verified && (status !== VERIFY_FAIL) &&
          <div className="verifyCtrl">
            <div className="verifyCtrl__message">
              { formatMessage(messages.verificationEmail, { name: getFirstname(user.fullname) }) }
            </div>
            <div className="verifyCtrl__signOutForm">
              { formatMessage(messages.verificationRequired) } <button onClick={signOut}>{ formatMessage(messages.signOut) }</button>
            </div>
          </div>
        }
        { user && (timer !== 0) &&
          <div className="verifyCtrl">
            <div className="verifyCtrl__message">
              { formatMessage(messages.verificationSuccess) }
            </div>
          </div>
        }
        { (status === VERIFY_FAIL) && error &&
          <div className="verifyCtrl">
            <div className="verifyCtrl__message">
              { formatMessage(messages.verificationFail) }
            </div>
            <div className="verifyCtrl__signOutForm">
              { formatMessage(messages.verificationRequired) } <button onClick={signOut}>{ formatMessage(messages.signOut) }</button>
            </div>
          </div>
        }
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

export default injectIntl(connect(selectors, actions)(HomePage))
