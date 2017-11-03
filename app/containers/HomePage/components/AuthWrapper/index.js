import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import axios from 'axios'
import className from 'classnames'
import { LOGIN_REQUEST, REGISTER_REQUEST, LOGIN_FAIL, CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from 'containers/App/constants'
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
    coverImg: PropTypes.string,
    profilePic: PropTypes.string,
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
    const { registerRequest, coverImg, profilePic } = this.props
    const { email, password, confirmPassword, fullname, profile_pic, cover_img } = values

    let data = {
      email,
      password,
      confirmPassword,
      fullname,
      profile_pic: profile_pic ? '' : profilePic,
      cover_img: cover_img ? '' : coverImg,
    }

    if (!profile_pic && !cover_img) {
      registerRequest(data)
    } else {
      this.setState({
        imageUpload: {
          uploading: true,
          error: false,
        },
      })

      let cnt = 0
      if (profile_pic) cnt += 1
      if (cover_img) cnt += 1

      if (profile_pic) {
        let formData = new FormData()
        formData.append('file', profile_pic[0])
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        axios.post(CLOUDINARY_UPLOAD_URL, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then(res => {
          const { data: { url } } = res
          cnt -= 1
          data.profile_pic = url

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

      if (cover_img) {
        let formData = new FormData()
        formData.append('file', cover_img[0])
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        axios.post(CLOUDINARY_UPLOAD_URL, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then(res => {
          const { data: { url } } = res
          cnt -= 1
          data.cover_img = url

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
    const { info: { status }, show, loginRequest } = this.props

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
