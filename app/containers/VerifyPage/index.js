import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import className from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container, Row, Col } from 'reactstrap'
import { verifyRequest } from 'containers/App/actions'
import { selectAuthenticated, selectUser, selectVerifyInfo } from 'containers/App/selectors'
import Logo from 'components/Logo'
import Menu from 'components/Menu'
import './style.scss'

class VerifyPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showHelp: false,
      timer: 5,
    }
  }

  componentWillMount() {
    const { vcode } = this.props.params

    if (vcode) {
      this.props.verifyRequest({ vcode })
    }

    let rand = Math.floor((Math.random() * 76)) + 1
    this.coverImgRand = (rand < 10) ? `000${rand}` : `00${rand}`;
    this.profilePicRand = Math.floor((Math.random() * 9))
  }

  handleHelpToggle = () => {
    this.setState({
      showHelp: !this.state.showHelp,
    })
  }

  render() {
    const { authenticated, user, verify } = this.props
    const { showHelp, timer } = this.state

    const helpClass = className({
      'verifyAlert__help--hidden': !showHelp,
    })

    const coverImg = (authenticated && user.cover_img) ? user.cover_img : `http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/wide/${this.coverImgRand}.jpg`
    const profileImg = (authenticated && user.profile_pic) ? user.profile_pic : `http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/profile/bag/${this.profilePicRand}.jpg`

    if (user && user.verified) {
      setTimeout(() => {
        if (timer === 0) {
          browserHistory.push('/home')
        } else {
          this.setState({
            timer: timer - 1,
          })
        }
      }, 1000)
    }

    return (
      <Container fluid className="verifypage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <Logo />
        <Menu />
        <Row className="verifypage__row">
          <Col md={12} sm={12} className="verifypage__col">
            <img className="verifypage__background" src={coverImg} role="presentation" />

            { verify.error &&
              <div className="verifyNotice">
                {verify.error}
              </div>
            }

            { user && user.verified &&
              <div className="verifyNotice">
                Verificiation Success. <br />
                You will be automatically redirected in { timer } seconds ...
              </div>
            }
            <div className="verifyAlert">
              <div className="verifyAlert__profilePic">
                <img src={profileImg} role="presentation" />
              </div>
              <div className="verifyAlert__message">
                <div>
                  We sent a mail to<br />
                  <b>{ user.email }</b><br />
                  Please verify your email.
                </div>
                <div className={helpClass}>
                  Having trouble? Send us a mail<br />
                  <b>m.snelder@gmail.com</b>
                </div>
                <button type="button" className="verifyAlert__helpButton" onClick={this.handleHelpToggle}>Help</button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

VerifyPage.propTypes = {
  verifyRequest: PropTypes.func,
  authenticated: PropTypes.bool,
  user: PropTypes.object,
  verify: PropTypes.object,
  params: PropTypes.object,
}

const selectors = createStructuredSelector({
  authenticated: selectAuthenticated(),
  user: selectUser(),
  verify: selectVerifyInfo(),
})

const actions = {
  verifyRequest,
}

export default connect(selectors, actions)(VerifyPage)
