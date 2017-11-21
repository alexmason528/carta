import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { showSnack, dismissSnack } from 'react-redux-snackbar'
import { dispatch } from 'react-redux'
import { signOut } from 'containers/App/actions'
import { VERIFY_FAIL } from 'containers/App/constants'
import messages from 'containers/HomePage/messages'

class Verify extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    signOut: PropTypes.func,
    name: PropTypes.string,
    status: PropTypes.string,
    intl: intlShape.isRequired,
  }

  render() {
    const { name, status, intl: { formatMessage }, signOut } = this.props

    let verifyMessage =
    (status === VERIFY_FAIL)
    ? formatMessage(messages.verificationFail)
    : formatMessage(messages.verificationEmail, { name })

    return (
      <div className="verifyCtrl">
        <div className="verifyCtrl__message">
          { verifyMessage }
        </div>
        <div className="verifyCtrl__signOutForm">
          { formatMessage(messages.verificationRequired) } <button onClick={signOut}>{ formatMessage(messages.signOut) }</button>
        </div>
      </div>
    )
  }
}

export default injectIntl(Verify)
