import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import className from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container, Row, Col } from 'reactstrap'
import { VERIFY_FAIL } from 'containers/App/constants'
import { selectAuthenticated, selectUser, selectInfo } from 'containers/App/selectors'
import { logOut, verifyRequest } from 'containers/App/actions'
import Logo from 'components/Logo'
import Menu from 'components/Menu'
import { AddPostButton } from 'components/Buttons'
import { selectPosts, selectSuggestions } from './selectors'
import { fetchCommunityInfoRequest } from './actions'
import { AccountMenu, AuthWrapper, Post, Profile, Quest, Suggestion, VerifyCtrl } from './components'
import './style.scss'

class HomePage extends Component {
  static propTypes = {
    fetchCommunityInfoRequest: PropTypes.func,
    verifyRequest: PropTypes.func,
    logOut: PropTypes.func,
    user: PropTypes.object,
    info: PropTypes.object,
    params: PropTypes.object,
    posts: PropTypes.array,
    suggestions: PropTypes.array,
    authenticated: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      showAuthWrapper: false,
      showAddPostForm: false,
      showAccountMenu: false,
      timer: 0,
    }
  }

  componentWillMount() {
    const { fetchCommunityInfoRequest, verifyRequest, params: { vcode } } = this.props

    if (vcode) {
      verifyRequest({ vcode })
    }
    fetchCommunityInfoRequest()
  }

  componentWillReceiveProps(nextProps) {
    const { user, params: { vcode } } = this.props
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

  handleProfileClick = () => {
    const { authenticated } = this.props

    if (!authenticated) {
      this.setState({
        showAuthWrapper: !this.state.showAuthWrapper,
      })
    } else {
      this.setState({
        showAccountMenu: !this.state.showAccountMenu,
      })
    }
  }

  toggleAddPostForm = () => {
    this.setState({
      showAddPostForm: !this.state.showAddPostForm,
    })
  }

  toggleAuthWrapper = () => {
    this.setState({
      showAuthWrapper: !this.state.showAuthWrapper,
    })
  }

  render() {
    const { showAuthWrapper, showAddPostForm, showAccountMenu, timer } = this.state
    const { posts, suggestions, authenticated, user, logOut, info: { status, error } } = this.props

    let addPostButtonType = 'text'

    if (posts.length > 0 && posts[0].img) {
      addPostButtonType = 'image'
    }

    return (
      <Container fluid className="homepage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <Logo />
        <Menu />
        <Row className="homepage__row">
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col">
            <Profile onClick={this.handleProfileClick} authenticated={authenticated} user={user} />
            { !authenticated && <AuthWrapper show={showAuthWrapper} onClose={this.toggleAuthWrapper} /> }
            { authenticated && <AccountMenu show={showAccountMenu} /> }
            <Quest authenticated={authenticated} />
          </Col>

          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col hidden-sm-down">
            { !showAddPostForm && authenticated && user.verified && <AddPostButton type={addPostButtonType} show={showAddPostForm} onClick={this.toggleAddPostForm} />}
            { /* authenticated && <Post onClose={this.toggleAddPostForm} /> */ }
            <div>
              {
                posts && posts.map((post, key) => {
                  const { _id, content, created_at, img, title, link } = post
                  let data = { _id, content, created_at, img, title, link }

                  data.username = `${post.author[0].firstname} ${post.author[0].lastname}`
                  data.editable = (authenticated && post.author[0]._id === user._id)
                  data.key = key

                  if (content.length === 0) data.content = null
                  if (img.length === 0) data.img = null

                  data.first = (key === 0 && authenticated)

                  return <Post {...data} />
                })
              }
            </div>
          </Col>
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col hidden-md-down">
            {
              suggestions && suggestions.map((suggestion, index) => <Suggestion key={index} imageUrl={suggestion.img} title={suggestion.title} />)
            }
          </Col>
        </Row>
        { user && !user.verified && (status !== VERIFY_FAIL) &&
          <div className="verifyCtrl">
            <div className="verifyCtrl__message">
              {`Hey ${user.firstname} ${user.lastname}, you've got an email from us. Please open it and click on the link to verify your account`}
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
})

const actions = {
  fetchCommunityInfoRequest,
  verifyRequest,
  logOut,
}

export default connect(selectors, actions)(HomePage)
