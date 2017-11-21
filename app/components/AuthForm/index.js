import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import axios from 'axios'
import cx from 'classnames'
import { compose } from 'redux'
import { injectIntl, intlShape } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import RenderField from 'components/RenderField'
import RenderDropzone from 'components/RenderDropzone'
import {
  SIGNIN_REQUEST,
  SIGNIN_FAIL,
  REGISTER_REQUEST,
  REGISTER_FAIL,
  CLOUDINARY_UPLOAD_URL,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_ICON_URL,
} from 'containers/App/constants'
import { signInRequest, registerRequest } from 'containers/App/actions'
import { selectInfo } from 'containers/App/selectors'
import messages from 'containers/HomePage/messages'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import authFormValidator from './validate'

import './style.scss'

class AuthForm extends Component {
  static propTypes = {
    signInRequest: PropTypes.func,
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
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      authType: 'signIn',
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

    if (status === SIGNIN_FAIL && error === 'Change email or register at Carta') {
      this.setState({
        authType: 'register',
      })
    } else if (status === REGISTER_FAIL && error === 'You are already registered. Please sign in.') {
      this.setState({
        authType: 'signIn',
      })
    }
  }

  handleAuthTypeChange = authType => {
    this.setState({
      authType,
      signInError: null,
      registerError: null,
    })
  }

  handleSubmit = values => {
    const { authType } = this.state
    if (authType === 'signIn') {
      this.handleSignIn(values)
    } else if (authType === 'register') {
      this.handleRegister(values)
    }
  }

  handleSignIn = values => {
    const { signInRequest } = this.props
    this.setState({
      email: values.email,
      password: values.password,
    }, () => {
      signInRequest(values)
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
      this.setState({ imageUpload: { uploading: true, error: false } })

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
            this.setState({ imageUpload: { uploading: false, error: null } })
          }
        }).catch(err => {
          this.setState({ imageUpload: { uploading: false, error: err.toString() } })
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
            this.setState({ imageUpload: { uploading: false, error: null } })
          }
        }).catch(err => {
          this.setState({ imageUpload: { uploading: false, error: err.toString() } })
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
    const { info: { status, error }, show, signInRequest, onCoverPicChange, onProfilePicChange, handleSubmit, intl: { formatMessage } } = this.props

    const spinnerShow = status === SIGNIN_REQUEST || status === REGISTER_REQUEST || imageUpload.uploading

    const param = authType === 'signIn' ? 'register' : 'signIn'

    return (
      <div className={cx({ authForm: true, 'authForm--hidden': !show })} onClick={evt => evt.stopPropagation()}>
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        <div className="authForm__divider">
          <span>{formatMessage(messages.with)}</span>
        </div>
        <div className="authForm__socialButtons">
          <GoogleLogin
            clientId={'658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com'}
            onSuccess={this.handleGoogleLoginSuccess}
            onFailure={this.handleGoogleLoginFail}
            className="button"
            style={{}}
          >
            <img src={`${CLOUDINARY_ICON_URL}/google.png`} role="presentation" /><span>Google</span>
          </GoogleLogin>
          <FacebookLogin
            appId="1088597931155576"
            fields="name,email,picture"
            callback={this.handleFacebookLogin}
            textButton="Facebook"
            autoLoad
          >
          </FacebookLogin>
        </div>
        <div className="authForm__divider">
          <span>{formatMessage(messages.or)}</span>
        </div>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field
            name="email"
            type="email"
            component={RenderField}
            label={formatMessage(messages.email)}
            order={1}
          />
          <Field
            name="password"
            type="password"
            component={RenderField}
            label={formatMessage(messages.password)}
            order={2}
          />
          { authType === 'register' && <div>
            <Field
              name="confirmPassword"
              type="password"
              component={RenderField}
              label={formatMessage(messages.repeatPassword)}
              order={2}
            />
            <Field
              name="fullname"
              type="text"
              component={RenderField}
              label={formatMessage(messages.fullname)}
              order={3}
            />
            <div className="authForm__uploadButtons">
              <Field
                className="authForm__uploadButton"
                name="profilePic"
                label={formatMessage(messages.profilePic)}
                onChange={onProfilePicChange}
                component={RenderDropzone}
                crop="portrait"
              />
              <Field
                className="authForm__uploadButton"
                name="coverPic"
                label={formatMessage(messages.coverPic)}
                onChange={onCoverPicChange}
                component={RenderDropzone}
                crop="landscape"
              />
            </div>
          </div> }
          <div className="authForm__authButtons">
            <button className="authForm__authButton authForm__authButton--active">
              { authType === 'signIn' ? formatMessage(messages.signIn) : formatMessage(messages.register) }
            </button>
            <button className="authForm__authButton authForm__authButton--inactive" type="button" onClick={() => { this.handleAuthTypeChange(param) }}>
              { authType !== 'signIn' ? formatMessage(messages.signIn) : formatMessage(messages.register) }
            </button>
          </div>
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
  signInRequest,
  registerRequest,
}

export default injectIntl(compose(
  connect(selectors, actions),
  reduxForm({
    form: 'authForm',
    validate: authFormValidator,
  }),
)(AuthForm))

