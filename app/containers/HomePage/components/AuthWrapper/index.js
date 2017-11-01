import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Loader from 'react-loader-advanced'
import className from 'classnames'
import { LOGIN_REQUEST, REGISTER_REQUEST, LOGIN_FAIL } from 'containers/App/constants'
import { loginRequest, registerRequest } from 'containers/App/actions'
import { selectInfo } from 'containers/App/selectors'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import './style.scss'

class AuthWrapper extends Component {
  static propTypes = {
    loginRequest: PropTypes.func,
    registerRequest: PropTypes.func,
    info: PropTypes.object,
    show: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      authType: 'login',
      email: '',
      password: '',
      loginError: null,
      registerError: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { info: { status, error } } = nextProps

    if (status === LOGIN_FAIL && error === 'Invalid username') {
      this.setState({
        loginError: null,
        authType: 'register',
      })
    } else {
      this.setState({
        ...this.state,
        loginError: error,
        registerError: error,
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

  handleLogin = values => {
    const { loginRequest } = this.props
    this.setState({
      email: values.email,
      password: values.password,
    }, () => {
      loginRequest(values)
    })
  }

  handleRegister = values => {
    const { registerRequest } = this.props

    let formData = new FormData()

    for (let key in values) {
      if (key === 'profile_pic' || key === 'cover_img') {
        formData.append(key, values[key][0])
      } else {
        formData.append(key, values[key])
      }
    }

    registerRequest(formData)
  }

  render() {
    const { authType, loginError, registerError, email, password } = this.state
    const { info: { status }, show, loginRequest } = this.props

    const spinnerShow = status === LOGIN_REQUEST || status === REGISTER_REQUEST

    const authWrapperClass = className({
      authWrapper: true,
      'authWrapper--hidden': !show,
    })

    return (
      <div className={authWrapperClass} onClick={evt => evt.stopPropagation()}>
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        <div className="authWrapper__divider">
          <span>With</span>
        </div>
        <div className="authWrapper__inlineButtons">
          <button type="button"><img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784819/image/icon/logo/google.png" role="presentation" /><span>Google</span></button>
          <button type="button"><img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784819/image/icon/logo/facebook.png" role="presentation" /><span>Facebook</span></button>
        </div>
        <div className="authWrapper__divider">
          <span>Or</span>
        </div>
        { authType === 'login' && <LoginForm onSubmit={this.handleLogin} loginError={loginError} onAuthTypeChange={this.handleAuthTypeChange} /> }
        { authType === 'register' && <RegisterForm onSubmit={this.handleRegister} registerError={registerError} onAuthTypeChange={this.handleAuthTypeChange} email={email} password={password} /> }
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  info: selectInfo(),
})

const actions = {
  loginRequest,
  registerRequest,
}

export default connect(selectors, actions)(AuthWrapper)
