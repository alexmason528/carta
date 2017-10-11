/*
 * VerifyPage
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
import './style.scss'

class VerifyPage extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)

    this.state = {
      showHelp: false,
    }
  }

  componentWillMount() {
    let rand = Math.floor((Math.random() * 76)) + 1
    this.coverImgRand = (rand < 10) ? `000${rand}` : `00${rand}`;
    this.profilePicRand = Math.floor((Math.random() * 9))
  }

  toggleHelp = () => {
    this.setState({
      showHelp: !this.state.showHelp,
    })
  }

  render() {
    const { authenticated, user } = this.props
    const { showHelp } = this.state

    const helpClass = className({
      'verifyAlert__help--hidden': !showHelp,
    })

    const coverImg = (authenticated && user.cover_img) ? user.cover_img : `http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/wide/${this.coverImgRand}.jpg`
    const profileImg = (authenticated && user.profile_pic) ? user.profile_pic : `http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/profile/bag/${this.profilePicRand}.jpg`

    return (
      <Container fluid className="verifypage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <Logo />
        <LogoTab />
        <Row className="verifypage__row">
          <Col md={12} sm={12} className="verifypage__col">
            <img className="verifypage__background" src={coverImg} role="presentation" />
          </Col>
        </Row>
        <div className="verifyAlert">
          <div className="verifyAlert__profilePic">
            <img src={profileImg} role="presentation" />
          </div>
          <div className="verifyAlert__message">
            <div>
              We sent a mail to<br />
              <b>martijn.snelder@gmail.com</b><br />
              Please verify your email.
            </div>
            <div className={helpClass}>
              Having trouble? Send us a mail<br />
              <b>m.snelder@gmail.com</b>
            </div>
            <button type="button" className="verifyAlert__helpButton" onClick={this.toggleHelp}>Help</button>
          </div>
        </div>
      </Container>
    )
  }
}

VerifyPage.propTypes = {
  authenticated: PropTypes.bool,
  user: PropTypes.object,
}

const mapStateToProps = createStructuredSelector({
  authenticated: selectAuthenticated(),
  user: selectUser(),
})

export default connect(mapStateToProps)(VerifyPage)
