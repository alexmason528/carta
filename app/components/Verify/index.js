import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { browserHistory } from 'react-router'
import { VERIFY_SUCCESS, VERIFY_FAIL } from 'containers/App/constants'
import { getFirstname } from 'utils/stringHelper'
import messages from 'containers/HomePage/messages'

class Verify extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    signOut: PropTypes.func,
    user: PropTypes.object,
    status: PropTypes.string,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { timer: 0 }
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props
    if (nextProps.status === VERIFY_SUCCESS && nextProps.status !== status) {
      this.setState({
        timer: 5,
      }, () => {
        const intervalID =
        setInterval(() => {
          const { timer } = this.state
          if (timer === 0) {
            clearInterval(intervalID)
            browserHistory.push('/')
          } else {
            this.setState({ timer: timer - 1 })
          }
        }, 1000)
      })
    }
  }

  render() {
    const { user, status, intl: { formatMessage }, signOut } = this.props
    const { timer } = this.state

    let verifyMessage

    if (user && !user.verified && (status !== VERIFY_FAIL)) {
      verifyMessage = formatMessage(messages.verificationEmail, { name: getFirstname(user.fullname) })
    } else if (user && timer !== 0 && status === VERIFY_SUCCESS) {
      verifyMessage = formatMessage(messages.verificationSuccess, { timer })
    } else if (status === VERIFY_FAIL) {
      verifyMessage = formatMessage(messages.verificationFail)
    }

    return (
      verifyMessage
      ? (
        <div className="verifyCtrl">
          <div className="verifyCtrl__message">
            { verifyMessage }
          </div>
          { ((user && !user.verified) || status === VERIFY_FAIL) &&
            <div className="verifyCtrl__signOutForm">
              { formatMessage(messages.verificationRequired) } <button onClick={signOut}>{ formatMessage(messages.signOut) }</button>
            </div>
          }
        </div>
      )
      : null
    )
  }
}

export default injectIntl(Verify)
