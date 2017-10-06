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
import { selectAuthenticated } from 'containers/App/selectors'
import { ImagePost, TextPost, NormalPost } from './Component/Posts'
import { selectPosts, selectSuggestions } from './selectors'
import { fetchCommunityInfoRequest } from './actions'
import Suggestion from './Component/Suggestion'
import Quest from './Component/Quest'
import Profile from './Component/Profile'
import AuthForm from './Component/AuthForm'
import AddPostButton from './Component/AddPostButton'

import './style.scss'

const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super()
    this.state = {
      showAuthForm: false,
    }
  }

  componentWillMount() {
    this.props.fetchCommunityInfoRequest()
  }

  googleLogin = () => {
  }

  facebookLogin = () => {
  }

  closeAuthForm = () => {
    this.setState({
      showAuthForm: false,
    })
  }

  toggleAuthForm = () => {
    this.setState({
      showAuthForm: !this.state.showAuthForm,
    })
  }

  render() {
    const { showAuthForm } = this.state
    const { posts, suggestions, authenticated } = this.props

    const error = 'Wrong password'

    const authFormClass = className({
      authForm: true,
      'authForm--hidden': !showAuthForm,
    })

    const today = new Date()
    const todayStr = today.toJSON().slice(0, 10)

    const yesterday = new Date(today.setDate(today.getDate() - 1))
    const yesterdayStr = yesterday.toJSON().slice(0, 10)

    return (
      <Container fluid className="homepage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <img className="logo" onClick={() => { browserHistory.push('/') }} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/logo-100.png" role="presentation" />
        <div className="logo-name-tab">
          <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/name-vertical.png" role="presentation" />
        </div>
        <Row className="homepage__row">
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col">
            <Profile onClick={this.toggleAuthForm} />
            { !authenticated && <AuthForm className={authFormClass} onClose={this.closeAuthForm} /> }
            <Quest />
          </Col>

          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col hidden-sm-down">
            <AddPostButton />
            {
              posts.map((post, index) => {
                let component
                const { title, created_at, content, img, author } = post
                const username = `${author[0].firstname} ${author[0].lastname}`

                const date = created_at.slice(0, 10)
                const time = created_at.slice(11)

                const month = Months[parseInt(date.slice(5, 7), 10) - 1]
                let day = parseInt(date.slice(8, 10), 10)

                let suffix
                if (day % 10 === 1) {
                  suffix = 'st'
                } else if (day % 10 === 2) {
                  suffix = 'nd'
                } else if (day % 10 === 3) {
                  suffix = 'rd'
                } else {
                  suffix = 'th'
                }

                day = `${day}${suffix}`

                let dateStr

                if (date === yesterdayStr) {
                  dateStr = 'yesterday '
                } else if (date === todayStr) {
                  dateStr = ''
                } else if (date.slice(0, 4) === todayStr.slice(0, 4)) {
                  dateStr = `${month} ${day}`
                } else {
                  dateStr = `${month} ${day}, ${date.slice(0, 4)}`
                }

                dateStr += ` ${time.slice(0, 5)}`

                if (content && img) {
                  component = <NormalPost key={index} imageUrl={img} title={title} username={username} date={dateStr} content={content} />
                } else if (content && !img) {
                  component = <TextPost key={index} title={title} username={username} date={dateStr} content={content} />
                } else if (!content && img) {
                  component = <ImagePost key={index} imageUrl={img} title={title} username={username} date={dateStr} />
                }

                return component
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
  suggestions: PropTypes.array,
  authenticated: PropTypes.bool,
}

const mapStateToProps = createStructuredSelector({
  posts: selectPosts(),
  suggestions: selectSuggestions(),
  authenticated: selectAuthenticated(),
})

function mapDispatchToProps(dispatch) {
  return {
    fetchCommunityInfoRequest: () => dispatch(fetchCommunityInfoRequest()),
  }
}
// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
