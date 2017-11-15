import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import axios from 'axios'
import className from 'classnames'
import { compose } from 'redux'
import { reduxForm, Field } from 'redux-form'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import RenderField from 'components/RenderField'
import RenderDropzone from 'components/RenderDropzone'
import { LOGIN_REQUEST, REGISTER_REQUEST, LOGIN_FAIL, REGISTER_FAIL, CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { loginRequest, registerRequest } from 'containers/App/actions'
import { selectInfo } from 'containers/App/selectors'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import authFormValidator from './validate'
import './style.scss'

class AuthForm extends Component {
  static propTypes = {
    loginRequest: PropTypes.func,
    registerRequest: PropTypes.func,
    onCoverPicChange: PropTypes.func,
    onProfilePicChange: PropTypes.func,
    handleSubmit: PropTypes.func,
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
      error: null,
      imageUpload: {
        uploading: false,
        error: null,
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    const { info: { status, error } } = nextProps

    if (status === LOGIN_FAIL && error === 'Invalid email') {
      this.setState({
        authType: 'register',
      })
    } else if (status === REGISTER_FAIL && error === 'You are already registered. Please sign in.') {
      this.setState({
        authType: 'login',
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

  handleSubmit = values => {
    const { authType } = this.state
    if (authType === 'login') {
      this.handleLogin(values)
    } else if (authType === 'register') {
      this.handleRegister(values)
    }
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

  handleGoogleLoginSuccess = res => {
  }

  handleGoogleLoginFail = err => {
  }

  handleFacebookLogin = res => {
  }

  render() {
    const { authType, email, password, imageUpload } = this.state
    const { info: { status, error }, show, loginRequest, onCoverPicChange, onProfilePicChange, handleSubmit } = this.props

    const spinnerShow = status === LOGIN_REQUEST || status === REGISTER_REQUEST || imageUpload.uploading

    const authFormClass = className({
      authForm: true,
      'authForm--hidden': !show,
    })

    return (
      <div className={authFormClass} onClick={evt => evt.stopPropagation()}>
        <LoadingSpinner show>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        <div className="authForm__divider">
          <span>With</span>
        </div>
        <div className="authForm__socialButtons">
          <GoogleLogin
            clientId={'658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com'}
            onSuccess={this.handleGoogleLoginSuccess}
            onFailure={this.handleGoogleLoginFail}
            className="button"
            style={{}}
          >
            <img className="img20" src={`${CLOUDINARY_ICON_URL}/google.png`} role="presentation" /><span>Google</span>
          </GoogleLogin>
          <FacebookLogin
            appId="1088597931155576"
            fields="name,email,picture"
            callback={this.handleFacebookLogin}
            textButton="Facebook"
            autoLoad
          >
            <img className="img20" src={`${CLOUDINARY_ICON_URL}/facebook.png`} role="presentation" /><span>Facebook</span>
          </FacebookLogin>
        </div>
        <div className="authForm__divider">
          <span>Or</span>
        </div>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field
            name="email"
            type="email"
            component={RenderField}
            label="Email"
            order={1}
          />
          <Field
            name="password"
            type="password"
            component={RenderField}
            label="Password"
            order={2}
          />
          { authType === 'register' && <div>
            <Field
              name="confirmPassword"
              type="password"
              component={RenderField}
              label="Repeat password"
              order={2}
            />
            <Field
              name="fullname"
              type="text"
              component={RenderField}
              label="Full name"
              order={3}
            />
            <div className="authForm__uploadButtons">
              <Field
                className="authForm__uploadButton"
                name="profilePic"
                label="Profile Pic"
                onChange={onProfilePicChange}
                component={RenderDropzone}
                crop="portrait"
              />
              <Field
                className="authForm__uploadButton"
                name="coverPic"
                label="Cover Pic"
                onChange={onCoverPicChange}
                component={RenderDropzone}
                crop="landscape"
              />
            </div>
          </div> }
          { authType === 'login'
            ? <div className="authForm__authButtons">
              <button className="authForm__authButton authForm__authButton--active">Sign in</button>
              <button className="authForm__authButton authForm__authButton--inactive" type="button" onClick={() => { this.handleAuthTypeChange('register') }}>Register</button>
            </div>
            : <div className="authForm__authButtons">
              <button className="authForm__authButton authForm__authButton--active">Register</button>
              <button className="authForm__authButton authForm__authButton--inactive" type="button" onClick={() => { this.handleAuthTypeChange('login') }}>Sign in</button>
            </div>
          }
          { error && <div className="error">{error}</div> }
        </form>
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

export default compose(
  connect(selectors, actions),
  reduxForm({
    form: 'authForm',
    validate: authFormValidator,
  }),
)(AuthForm)
