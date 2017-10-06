import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { loginRequest } from 'containers/App/actions'
import { selectLoginError, selectRegisterError, selectUser } from 'containers/App/selectors'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import './style.scss'

class AuthForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      authType: 'login',
      loginError: null,
      registerError: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loginError, registerError } = nextProps

    if (loginError === 'Invalid username') {
      this.setState({
        loginError: null,
        authType: 'register',
      })
    } else {
      this.setState({
        ...this.state,
        loginError,
        registerError,
      })
    }
  }

  handleLoginSubmit = values => {
    this.props.loginRequest(values)
  }

  handleRegisterSubmit = values => {
  }

  handleAuthTypeChange = authType => {
    this.setState({
      authType,
      loginError: null,
      registerError: null,
    })
  }

  render() {
    const { authType, loginError, registerError, userInfo } = this.state

    return (
      <div className={this.props.className}>
        <button className="authForm__closeBtn" onClick={this.props.onClose}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/close.png" role="presentation" /></button>
        <div className="authForm__divider">
          <span>With</span>
        </div>
        <div className="authForm__inlineButtons">
          <button onClick={this.googleLogin}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784819/image/icon/logo/google.png" role="presentation" /><span>Google</span></button>
          <button onClick={this.facebookLogin}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784819/image/icon/logo/facebook.png" role="presentation" /><span>Facebook</span></button>
        </div>
        <div className="authForm__divider">
          <span>Or</span>
        </div>
        { authType === 'login' && <LoginForm onSubmit={this.handleLoginSubmit} loginError={loginError} onAuthTypeChange={this.handleAuthTypeChange} /> }
        { authType === 'register' && <RegisterForm onSubmit={this.handleLoginSubmit} registerError={registerError} onAuthTypeChange={this.handleAuthTypeChange} /> }
      </div>
    )
  }
}

AuthForm.propTypes = {
  loginRequest: PropTypes.func,
  onClose: PropTypes.func,
  loginError: PropTypes.string,
  registerError: PropTypes.string,
  className: PropTypes.string,
}

const mapStateToProps = createStructuredSelector({
  loginError: selectLoginError(),
  registerError: selectRegisterError(),
})

const mapDispatchToProps = dispatch => {
  return {
    loginRequest: payload => dispatch(loginRequest(payload)),
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(AuthForm)
