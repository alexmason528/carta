import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { browserHistory } from 'react-router'
import { VERIFY_USER_SUCCESS, VERIFY_USER_FAIL } from 'containers/App/constants'
import { getFirstname } from 'utils/stringHelper'
import messages from 'containers/HomePage/messages'
import './style.scss'

class Verify extends Component {
  static propTypes = {
    signOutUser: PropTypes.func,
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
    if (nextProps.status === VERIFY_USER_SUCCESS && nextProps.status !== status) {
      this.setState(
        {
          timer: 5,
        },
        () => {
          const intervalID = setInterval(() => {
            const { timer } = this.state
            if (timer === 0) {
              clearInterval(intervalID)
              browserHistory.push('/')
            } else {
              this.setState({ timer: timer - 1 })
            }
          }, 1000)
        }
      )
    }
  }

  render() {
    const { user, status, intl: { formatMessage }, signOutUser } = this.props
    const { timer } = this.state

    let verifyMessage

    if (user && !user.verified && status !== VERIFY_USER_FAIL) {
      verifyMessage = formatMessage(messages.verificationEmail, {
        name: getFirstname(user.fullname),
      })
    } else if (user && timer !== 0 && status === VERIFY_USER_SUCCESS) {
      verifyMessage = formatMessage(messages.verificationSuccess, { timer })
    } else if (status === VERIFY_USER_FAIL) {
      verifyMessage = formatMessage(messages.verificationFail)
    }

    return verifyMessage ? (
      <div className="verifyCtrl">
        <div className="verifyCtrl__message Wb-Bw P-30">{verifyMessage}</div>
        {((user && !user.verified) || status === VERIFY_USER_FAIL) && (
          <div className="verifyCtrl__signOutForm Px-25 Py-15">
            {formatMessage(messages.verificationRequired)} <button onClick={signOutUser}>{formatMessage(messages.signOut)}</button>
          </div>
        )}
      </div>
    ) : null
  }
}

export default injectIntl(Verify)
