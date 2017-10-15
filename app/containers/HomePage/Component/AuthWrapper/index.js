import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Loader from 'react-loader-advanced'
import className from 'classnames'
import { loginRequest, registerRequest } from 'containers/App/actions'
import { selectLoginInfo, selectRegisterInfo } from 'containers/App/selectors'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import './style.scss'

class AuthWrapper extends Component {
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
    const { loginInfo, registerInfo, show } = this.props

    const spinnerShow = loginInfo.submitting || registerInfo.submitting

    const authWrapperClass = className({
      authWrapper: true,
      'authWrapper--hidden': !show,
    })

    return (
      <div className={authWrapperClass}>
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        <button className="authWrapper__closeBtn" onClick={this.props.onClose}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/close.png" role="presentation" /></button>
        <div className="authWrapper__divider">
          <span>With</span>
        </div>
        <div className="authWrapper__inlineButtons">
          <button onClick={this.googleLogin}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784819/image/icon/logo/google.png" role="presentation" /><span>Google</span></button>
          <button onClick={this.facebookLogin}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784819/image/icon/logo/facebook.png" role="presentation" /><span>Facebook</span></button>
        </div>
        <div className="authWrapper__divider">
          <span>Or</span>
        </div>
        { authType === 'login' && <LoginForm onSubmit={this.props.loginRequest} loginError={loginError} onAuthTypeChange={this.handleAuthTypeChange} /> }
        { authType === 'register' && <RegisterForm onSubmit={this.registerHandler} registerError={registerError} onAuthTypeChange={this.handleAuthTypeChange} /> }
      </div>
    )
  }
}

AuthWrapper.propTypes = {
  loginRequest: PropTypes.func,
  registerRequest: PropTypes.func,
  onClose: PropTypes.func,
  loginInfo: PropTypes.object,
  registerInfo: PropTypes.object,
  show: PropTypes.bool,
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

export default connect(mapStateToProps, mapDispatchToProps)(AuthWrapper)
