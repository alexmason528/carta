import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import axios from 'axios'
import className from 'classnames'
import { LOGIN_REQUEST, REGISTER_REQUEST, LOGIN_FAIL, CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_ICON_URL } from 'containers/App/constants'
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
    onCoverPicChange: PropTypes.func,
    onProfilePicChange: PropTypes.func,
    coverPic: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    profilePic: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
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
      imageUpload: {
        uploading: false,
        error: null,
      },
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
    const { email, password, confirmPassword, fullname, profilePic, coverPic } = values

    let data = {
      email,
      password,
      confirmPassword,
      fullname,
      profilePic: profilePic ? '' : this.props.profilePic,
      coverPic: coverPic ? '' : this.props.coverPic,
    }

    if (!profilePic && !coverPic) {
      registerRequest(data)
    } else {
      this.setState({
        imageUpload: {
          uploading: true,
          error: false,
        },
      })

      let cnt = 0
      if (profilePic) cnt += 1
      if (coverPic) cnt += 1

      if (profilePic) {
        let formData = new FormData()
        formData.append('file', profilePic)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        axios.post(CLOUDINARY_UPLOAD_URL, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then(res => {
          const { data: { url } } = res
          cnt -= 1
          data.profilePic = url

          if (cnt === 0) {
            registerRequest(data)
            this.setState({
              imageUpload: {
                uploading: false,
                error: null,
              },
            })
          }
        }).catch(err => {
          this.setState({
            imageUpload: {
              uploading: false,
              error: err.toString(),
            },
          })
        })
      }

      if (coverPic) {
        let formData = new FormData()
        formData.append('file', coverPic)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        axios.post(CLOUDINARY_UPLOAD_URL, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then(res => {
          const { data: { url } } = res
          cnt -= 1
          data.coverPic = url

          if (cnt === 0) {
            registerRequest(data)
            this.setState({
              imageUpload: {
                uploading: false,
                error: null,
              },
            })
          }
        }).catch(err => {
          this.setState({
            imageUpload: {
              uploading: false,
              error: err.toString(),
            },
          })
        })
      }
    }
  }

  render() {
    const { authType, loginError, registerError, email, password, imageUpload } = this.state
    const { info: { status }, show, loginRequest, onCoverPicChange, onProfilePicChange } = this.props

    const spinnerShow = status === LOGIN_REQUEST || status === REGISTER_REQUEST || imageUpload.uploading

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
          <button type="button"><img className="img20" src={`${CLOUDINARY_ICON_URL}/google.png`} role="presentation" /><span>Google</span></button>
          <button type="button"><img className="img20" src={`${CLOUDINARY_ICON_URL}/facebook.png`} role="presentation" /><span>Facebook</span></button>
        </div>
        <div className="authWrapper__divider">
          <span>Or</span>
        </div>
        { authType === 'login' && <LoginForm onSubmit={this.handleLogin} loginError={loginError} onAuthTypeChange={this.handleAuthTypeChange} /> }
        { authType === 'register' && <RegisterForm onSubmit={this.handleRegister} registerError={registerError} onAuthTypeChange={this.handleAuthTypeChange} email={email} password={password} onCoverPicChange={onCoverPicChange} onProfilePicChange={onProfilePicChange} /> }
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
