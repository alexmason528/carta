import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { showSnack, dismissSnack } from 'react-redux-snackbar'
import { dispatch } from 'react-redux'
import { logOut } from 'containers/App/actions'
import { VERIFY_FAIL } from 'containers/App/constants'
import messages from 'containers/HomePage/messages'

class Verify extends Component {
  static propTypes = {
    logOut: PropTypes.func,
    name: PropTypes.string,
    status: PropTypes.string,
    intl: intlShape.isRequired,
  }

  componentWillMount() {
    // console.log(this.props)
    // dispatch(showSnack('myUniqueId', {
    //   label: 'Yay, that actually worked!',
    //   timeout: 7000,
    //   button: { label: 'OK, GOT IT' },
    // }))
  }

  showSnackbar = () => {
    // alert('abc')
  }

  render() {
    const { name, status, intl: { formatMessage }, logOut } = this.props

    let verifyMessage =
    (status === VERIFY_FAIL)
    ? formatMessage(messages.verificationFail)
    : formatMessage(messages.verificationEmail, { name })

    return (
      <div className="verifyCtrl" onClick={this.showSnackBar}>
        <div className="verifyCtrl__message">
          { verifyMessage }
        </div>
        {/* <div className="verifyCtrl__logOutForm"> */}
        {/* { formatMessage(messages.verificationRequired) } <button onClick={logOut}>{ formatMessage(messages.signOut) }</button> */}
        {/* </div> */}
      </div>
    )
  }
}

export default injectIntl(Verify)
