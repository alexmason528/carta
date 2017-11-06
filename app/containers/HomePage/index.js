import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import className from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container, Row, Col } from 'reactstrap'
import { VERIFY_FAIL, CLOUDINARY_COVER_URL, CLOUDINARY_PROFILE_URL } from 'containers/App/constants'
import { selectAuthenticated, selectUser, selectInfo } from 'containers/App/selectors'
import { logOut, verifyRequest, updateUserRequest } from 'containers/App/actions'
import { CREATE_POST_SUCCESS } from 'containers/HomePage/constants'
import { CreatePostButton } from 'components/Buttons'
import Menu from 'components/Menu'
import { selectPosts, selectSuggestions, selectHomeInfo } from './selectors'
import { listPostRequest, listSuggestionRequest } from './actions'
import { AccountMenu, AuthWrapper, Post, PostCreate, Profile, Quest, Suggestion, VerifyCtrl } from './components'
import './style.scss'

class HomePage extends Component {
  static propTypes = {
    listPostRequest: PropTypes.func,
    listSuggestionRequest: PropTypes.func,
    updateUserRequest: PropTypes.func,
    verifyRequest: PropTypes.func,
    logOut: PropTypes.func,
    user: PropTypes.object,
    info: PropTypes.object,
    homeInfo: PropTypes.object,
    params: PropTypes.object,
    posts: PropTypes.array,
    suggestions: PropTypes.array,
    authenticated: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      showAuthWrapper: false,
      showCreatePostForm: false,
      showAccountMenu: false,
      showMenu: false,
      editingPost: false,
      timer: 0,
    }
  }

  componentWillMount() {
    let rand = Math.floor((Math.random() * 76)) + 1
    const coverPicRand = (rand < 10) ? `000${rand}` : `00${rand}`;
    const profilePicRand = Math.floor((Math.random() * 9))

    this.coverPic = `${CLOUDINARY_COVER_URL}/${coverPicRand}.jpg`
    this.profilePic = `${CLOUDINARY_PROFILE_URL}/${profilePicRand}.jpg`

    const { listPostRequest, listSuggestionRequest, verifyRequest, params: { vcode } } = this.props

    if (vcode) {
      verifyRequest({ vcode })
    }
    listPostRequest()
    listSuggestionRequest()
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowClick)
  }

  componentWillReceiveProps(nextProps) {
    const { user, params: { vcode } } = this.props
    const { homeInfo: { status } } = nextProps

    if (status === CREATE_POST_SUCCESS) {
      this.setState({
        showCreatePostForm: false,
      })
    }

    if ((!user && vcode && nextProps.user && nextProps.user.verified === true) || (user && nextProps.user && user.verified === false && nextProps.user.verified === true)) {
      this.setState({
        timer: 5,
      }, () => {
        setInterval(() => {
          const { timer } = this.state
          if (timer !== 0) {
            this.setState({
              timer: timer - 1,
            })
          } else {
            browserHistory.push('/home')
          }
        }, 1000)
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick)
  }

  handleWindowClick = () => {
    this.setState({
      showAccountMenu: false,
      showAuthWrapper: false,
    })
  }

  handleProfileClick = evt => {
    const { authenticated } = this.props

    if (!authenticated) {
      evt.stopPropagation()
      this.setState({
        showAuthWrapper: !this.state.showAuthWrapper,
      })
    } else {
      this.setState({
        showAccountMenu: !this.state.showAccountMenu,
      })
    }
  }

  toggleCreatePostForm = () => {
    this.setState({
      showCreatePostForm: !this.state.showCreatePostForm,
    })
  }

  toggleMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu,
    })
  }

  handlePostEdit = value => {
    this.setState({
      editingPost: value,
    })
  }

  render() {
    const { showAuthWrapper, showCreatePostForm, showAccountMenu, showMenu, timer, editingPost } = this.state
    const { posts, suggestions, authenticated, user, logOut, updateUserRequest, info } = this.props
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
        <Menu />
        <Row className="homepage__row">
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col">
            <Profile
              onClick={this.handleProfileClick}
              onUpdate={updateUserRequest}
              authenticated={authenticated}
              user={user}
              info={info}
              coverPic={this.coverPic}
              profilePic={this.profilePic}
            />
            { authenticated ? <AccountMenu show={showAccountMenu} /> : <AuthWrapper show={showAuthWrapper} coverPic={this.coverPic} profilePic={this.profilePic} /> }
            <Quest authenticated={authenticated} />
          </Col>

          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col hidden-sm-down">
            { authenticated && !showCreatePostForm && user.verified && !editingPost && <CreatePostButton type={createPostButtonType} onClick={this.toggleCreatePostForm} />}
            { authenticated && showCreatePostForm && <PostCreate onClose={this.toggleCreatePostForm} user={user} /> }
            <div>
              {
                posts && posts.map((post, key) => {
                  const { _id, content, created_at, img, title, link } = post
                  let data = { _id, content, created_at, img, title, link }

                  data.username = post.author.fullname
                  data.editable = (authenticated && (post.author._id === user._id || user.role === 'admin'))
                  data.key = key

                  if (content.length === 0) data.content = null
                  if (img.length === 0) data.img = null

                  data.first = (key === 0 && authenticated)
                  return <Post {...data} onPostEdit={this.handlePostEdit} />
                })
              }
            </div>
          </Col>
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col hidden-md-down">
            { suggestions && suggestions.map((suggestion, index) => <Suggestion key={index} imageUrl={suggestion.img} title={suggestion.title} />) }
          </Col>
        </Row>
        { user && !user.verified && (status !== VERIFY_FAIL) &&
          <div className="verifyCtrl">
            <div className="verifyCtrl__message">
              {`Hey ${user.fullname}, you've got an email from us. Please open it and click on the link to verify your account`}
            </div>
            <div className="verifyCtrl__logOutForm">
              Please verify your registration or <button onClick={logOut}>Log out</button>
            </div>
          </div>
        }
        { user && (timer !== 0) &&
          <div className="verifyCtrl">
            <div className="verifyCtrl__message">
              Verification Success. This message will disapper in { timer } secondes...
            </div>
          </div>
        }
        { (status === VERIFY_FAIL) && error &&
          <div className="verifyCtrl">
            <div className="verifyCtrl__message">
              { 'Verification failed. Your verification code is not correct.'}
            </div>
            <div className="verifyCtrl__logOutForm">
              Please verify your registration or <button onClick={logOut}>Log out</button>
            </div>
          </div>
        }
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  posts: selectPosts(),
  suggestions: selectSuggestions(),
  authenticated: selectAuthenticated(),
  user: selectUser(),
  info: selectInfo(),
  homeInfo: selectHomeInfo(),
})

const actions = {
  listPostRequest,
  listSuggestionRequest,
  updateUserRequest,
  verifyRequest,
  logOut,
}

export default connect(selectors, actions)(HomePage)
