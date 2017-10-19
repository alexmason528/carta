/*
 * HomePage
 *
 */

import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import className from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container, Row, Col } from 'reactstrap'
import { selectAuthenticated, selectUser } from 'containers/App/selectors'
import Logo from 'components/Logo'
import LogoTab from 'components/LogoTab'
import { AddPostButton } from 'components/Buttons'
import { selectPosts, selectSuggestions } from './selectors'
import { fetchCommunityInfoRequest } from './actions'
import Suggestion from './Component/Suggestion'
import Quest from './Component/Quest'
import Profile from './Component/Profile'
import AuthWrapper from './Component/AuthWrapper'
import Post from './Component/Post'
import './style.scss'

class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
    this.state = {
      showAuthWrapper: false,
      showAddPostForm: false,
    }
  }

  componentWillMount() {
    this.props.fetchCommunityInfoRequest()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !nextProps.user.verified) {
      browserHistory.push('/verify')
    }
  }

  googleLogin = () => {
  }

  facebookLogin = () => {
  }

  toggleAuthWrapper = () => {
    this.setState({
      showAuthWrapper: !this.state.showAuthWrapper,
    })
  }

  toggleAddPostForm = () => {
    this.setState({
      showAddPostForm: !this.state.showAddPostForm,
    })
  }

  render() {
    const { showAuthWrapper, showAddPostForm } = this.state
    const { posts, suggestions, authenticated, user } = this.props

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
        <LogoTab />
        <Row className="homepage__row">
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col">
            <Profile onClick={this.toggleAuthWrapper} authenticated={authenticated} user={user} />
            { !authenticated && <AuthWrapper show={showAuthWrapper} onClose={this.toggleAuthWrapper} /> }
            <Quest />
          </Col>

          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col hidden-sm-down">
            { !showAddPostForm && authenticated && <AddPostButton type={addPostButtonType} show={showAddPostForm} onClick={this.toggleAddPostForm} />}
            { authenticated && <Post onClose={this.toggleAddPostForm} /> }
            <div>
              {
              posts.map(post => {
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
              suggestions.map((suggestion, index) => (<Suggestion key={index} imageUrl={suggestion.img} title={suggestion.title} />))
            }
          </Col>
        </Row>
      </Container>
    )
  }
}

HomePage.propTypes = {
  fetchCommunityInfoRequest: PropTypes.func,
  posts: PropTypes.array,
  user: PropTypes.object,
  suggestions: PropTypes.array,
  authenticated: PropTypes.bool,
}

const mapStateToProps = createStructuredSelector({
  posts: selectPosts(),
  suggestions: selectSuggestions(),
  authenticated: selectAuthenticated(),
  user: selectUser(),
})

const mapDispatchToProps = dispatch => {
  return {
    fetchCommunityInfoRequest: () => dispatch(fetchCommunityInfoRequest()),
  }
}
// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
