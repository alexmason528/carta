import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { logOut } from 'containers/App/actions'
import './style.scss'

class VerifyCtrl extends Component {
  static propTypes = {
    logOut: PropTypes.func,
    user: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      verified: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        verified: true,
      })
    }
  }

  render() {
    const { logOut, user: { firstname, lastname } } = this.props

    return (
      <div className="verifyCtrl">
        <div className="verifyCtrl__message">
          { `Hey ${firstname} ${lastname}, you've got an email from us. Please open it and click on the link to verify your account` }
        </div>
        <div className="verifyCtrl__logOutForm">
          Please verify your registration or <button onClick={logOut}>Log out</button>
        </div>
      </div>
    )
  }
}

const actions = {
  logOut,
}

export default connect(null, actions)(VerifyCtrl)
