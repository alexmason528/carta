import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Loader from 'react-loader-advanced'
import { loginRequest, registerRequest } from 'containers/App/actions'
import { selectLoginInfo, selectRegisterInfo } from 'containers/App/selectors'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
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
    const { loginInfo, registerInfo } = nextProps

    if (loginInfo.error === 'Invalid username') {
      this.setState({
        loginError: null,
        authType: 'register',
      })
    } else {
      this.setState({
        ...this.state,
        loginError: loginInfo.error,
        registerError: registerInfo.error,
      })
    }
  }

  handleAuthTypeChange = authType => {
    this.setState({
      authType,
      loginError: null,
      registerError: null,
    })
  }

  registerHandler = values => {
    let formData = new FormData()

    for (let key in values) {
      if (key === 'profile_pic' || key === 'cover_img') {
        formData.append(key, values[key][0])
      } else {
        formData.append(key, values[key])
      }
    }

    this.props.registerRequest(formData)
  }

  render() {
    const { authType, loginError, registerError } = this.state
    const { loginInfo, registerInfo } = this.props

    const spinnerShow = loginInfo.submitting || registerInfo.submitting

    return (
      <div className={this.props.className}>
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
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
        { authType === 'login' && <LoginForm onSubmit={this.props.loginRequest} loginError={loginError} onAuthTypeChange={this.handleAuthTypeChange} /> }
        { authType === 'register' && <RegisterForm onSubmit={this.registerHandler} registerError={registerError} onAuthTypeChange={this.handleAuthTypeChange} /> }
      </div>
    )
  }
}

AuthForm.propTypes = {
  loginRequest: PropTypes.func,
  registerRequest: PropTypes.func,
  onClose: PropTypes.func,
  loginInfo: PropTypes.object,
  registerInfo: PropTypes.object,
  className: PropTypes.string,
}

const mapStateToProps = createStructuredSelector({
  loginInfo: selectLoginInfo(),
  registerInfo: selectRegisterInfo(),
})

const mapDispatchToProps = dispatch => {
  return {
    loginRequest: payload => dispatch(loginRequest(payload)),
    registerRequest: payload => dispatch(registerRequest(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm)
