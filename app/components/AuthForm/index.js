import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { reduxForm, Field } from 'redux-form'
import { createStructuredSelector } from 'reselect'
import axios from 'axios'
import cx from 'classnames'
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
import {
  changeAuthMethod,
  signInRequest,
  registerRequest,
} from 'containers/App/actions'
import { selectInfo } from 'containers/App/selectors'
import messages from 'containers/HomePage/messages'
import LoadingSpinner from 'components/LoadingSpinner'
import Img from 'components/Img'
import { QuarterSpinner } from 'components/SvgIcon'
import authFormValidator from './validate'
import './style.scss'

class AuthForm extends Component {
  static propTypes = {
    signInRequest: PropTypes.func,
    registerRequest: PropTypes.func,
    onProfilePicChange: PropTypes.func,
    changeAuthMethod: PropTypes.func,
    handleSubmit: PropTypes.func,
    profilePic: PropTypes.string,
    info: PropTypes.object,
    show: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      formChanged: false,
      imageUpload: {
        uploading: false,
        error: null,
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    const { info: { status } } = this.props
    const { info } = nextProps

    if (
      status !== info.status &&
      (info.status === SIGNIN_FAIL || info.status === REGISTER_FAIL)
    ) {
      this.setState({ formChanged: false })
    }
  }

  handleSubmit = values => {
    const { info: { authMethod } } = this.props
    if (authMethod === 'signIn') {
      this.handleSignIn(values)
    } else if (authMethod === 'register') {
      this.handleRegister(values)
    }
  }

  handleSignIn = values => {
    const { signInRequest } = this.props
    const { email, password } = values
    this.setState({ email, password }, () => {
      signInRequest(values)
    })
  }

  handleRegister = values => {
    const { registerRequest } = this.props
    const { email, password, confirmPassword, fullname, profilePic } = values

    let data = {
      email,
      password,
      confirmPassword,
      fullname,
      profilePic: profilePic ? '' : this.props.profilePic,
    }

    if (!profilePic) {
      registerRequest(data)
    } else {
      this.setState({ imageUpload: { uploading: true, error: false } })
      let formData = new FormData()
      formData.append('file', profilePic)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      axios
        .post(CLOUDINARY_UPLOAD_URL, formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .then(res => {
          const { data: { url } } = res
          data.profilePic = url
          registerRequest(data)
          this.setState({ imageUpload: { uploading: false, error: null } })
        })
        .catch(err => {
          this.setState({
            imageUpload: { uploading: false, error: err.toString() },
          })
        })
    }
  }

  handleChangeAuthMethod = () => {
    const { info: { authMethod }, changeAuthMethod } = this.props
    const method = authMethod === 'signIn' ? 'register' : 'signIn'
    changeAuthMethod(method)
  }

  handleFormChange = evt => {
    const fields = ['email', 'password', 'text']
    const { target: { type } } = evt
    if (fields.indexOf(type) !== -1) {
      this.setState({ formChanged: true })
    }
  }

  handleGoogleLoginSuccess = () => {}

  handleGoogleLoginFail = () => {}

  handleFacebookLogin = () => {}

  render() {
    const {
      info: { status, error, authMethod },
      show,
      onProfilePicChange,
      handleSubmit,
      intl: { formatMessage },
    } = this.props

    const { formChanged, imageUpload } = this.state
    const spinnerShow =
      status === SIGNIN_REQUEST ||
      status === REGISTER_REQUEST ||
      imageUpload.uploading

    return (
      <div
        className={cx({ authForm: true, 'authForm--hidden': !show })}
        onClick={evt => evt.stopPropagation()}
      >
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        <div className="authForm__divider">
          <span className="Tt-U">{formatMessage(messages.with)}</span>
        </div>
        <div className="authForm__socialButtons">
          <GoogleLogin
            clientId={
              '658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com'
            }
            onSuccess={this.handleGoogleLoginSuccess}
            onFailure={this.handleGoogleLoginFail}
            className="button"
            style={{}}
          >
            <Img src={`${CLOUDINARY_ICON_URL}/google.png`} />
            <span>Google</span>
          </GoogleLogin>
          <FacebookLogin
            appId="1088597931155576"
            fields="name,email,picture"
            callback={this.handleFacebookLogin}
            textButton="Facebook"
            icon={<Img src={`${CLOUDINARY_ICON_URL}/facebook.png`} />}
            autoLoad
          />
        </div>
        <div className="authForm__divider">
          <span>{formatMessage(messages.or)}</span>
        </div>
        <form
          onSubmit={handleSubmit(this.handleSubmit)}
          onChange={this.handleFormChange}
        >
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
          {authMethod === 'register' && (
            <div>
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
              <Field
                className="authForm__profileButton"
                name="profilePic"
                label={formatMessage(messages.profilePic)}
                onChange={onProfilePicChange}
                component={RenderDropzone}
                crop="portrait"
              />
            </div>
          )}
          <div className="authForm__authButtons">
            <button className="authForm__authButton authForm__authButton--active">
              {authMethod === 'signIn'
                ? formatMessage(messages.signIn)
                : formatMessage(messages.register)}
            </button>
            <button
              className="authForm__authButton authForm__authButton--inactive"
              type="button"
              onClick={this.handleChangeAuthMethod}
            >
              {authMethod !== 'signIn'
                ? formatMessage(messages.signIn)
                : formatMessage(messages.register)}
            </button>
          </div>
          {!formChanged &&
            error &&
            (status === SIGNIN_FAIL || status === REGISTER_FAIL) && (
              <div className="error">{formatMessage({ id: error })}</div>
            )}
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
  changeAuthMethod,
}

export default compose(
  injectIntl,
  connect(selectors, actions),
  reduxForm({
    form: 'authForm',
    validate: authFormValidator,
  })
)(AuthForm)
