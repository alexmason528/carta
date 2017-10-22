import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import className from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container, Row, Col } from 'reactstrap'
import { selectAuthenticated, selectUser } from 'containers/App/selectors'
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
    }
  }

  componentWillMount() {
    const { fetchCommunityInfoRequest, verifyRequest, params: { vcode } } = this.props

    if (vcode) {
      verifyRequest({ vcode })
    }
    fetchCommunityInfoRequest()
  }

  // componentWillReceiveProps(nextProps) {
  //   const { user } = nextProps
  //   if (user && !user.verified) {
  //     browserHistory.push('/verify')
  //   }
  // }

  googleLogin = () => {
  }

  facebookLogin = () => {
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
    const { showAuthWrapper, showAddPostForm, showAccountMenu } = this.state
    const { posts, suggestions, authenticated, user, logOut } = this.props

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
            { !showAddPostForm && authenticated && <AddPostButton type={addPostButtonType} show={showAddPostForm} onClick={this.toggleAddPostForm} />}
            { authenticated && <Post onClose={this.toggleAddPostForm} /> }
            <div>
              {
                posts && posts.map(post => {
                  const { content, img, created_at, title } = post
                  let data = { content, img, created_at, title }

                  data.username = `${post.author[0].firstname} ${post.author[0].lastname}`
                  data.editable = (user && post.author[0]._id === user._id)
                  return <Post key={post._id} {...data} />
                })
              }
            </div>
          </Col>
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col hidden-md-down">
            {
              suggestions && suggestions.map((suggestion, index) => (<Suggestion key={index} imageUrl={suggestion.img} title={suggestion.title} />))
            }
          </Col>
        </Row>
        { user && !user.verified &&
          <div className="verifyCtrl">
            <div className="verifyCtrl__message">
              {`Hey ${user.firstname} ${user.lastname}, you've got an email from us. Please open it and click on the link to verify your account`}
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

const mapStateToProps = createStructuredSelector({
  posts: selectPosts(),
  suggestions: selectSuggestions(),
  authenticated: selectAuthenticated(),
  user: selectUser(),
})

const actions = {
  fetchCommunityInfoRequest,
  verifyRequest,
  logOut,
}

export default connect(mapStateToProps, actions)(HomePage)
