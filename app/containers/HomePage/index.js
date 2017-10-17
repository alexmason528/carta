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
import { ImagePost, TextPost, NormalPost } from './Component/Posts'
import { selectPosts, selectSuggestions } from './selectors'
import { fetchCommunityInfoRequest } from './actions'
import Suggestion from './Component/Suggestion'
import Quest from './Component/Quest'
import Profile from './Component/Profile'
import AuthWrapper from './Component/AuthWrapper'
import AddPostButton from './Component/AddPostButton'
import AddPostForm from './Component/AddPostForm'
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
            { authenticated && <AddPostForm show={showAddPostForm} onClose={this.toggleAddPostForm} /> }
            {
              posts.map((post, index) => {
                const { content, img } = post
                let data = { ...post }
                if (index === 0) {
                  data.first = true
                }

                const authorID = post.author[0]._id

                if (content && img) {
                  return <NormalPost key={index} {...data} editable={user && authorID === user._id} />
                } else if (content && !img) {
                  return <TextPost key={index} {...data} editable={user && authorID === user._id} />
                }
                return <ImagePost key={index} {...data} editable={user && authorID === user._id} />
              })
            }
          </Col>
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col hidden-md-down">
            {
              suggestions.map((suggestion, index) => {
                const { img, title } = suggestion
                return <Suggestion key={index} imageUrl={img} title={title} />
              })
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
