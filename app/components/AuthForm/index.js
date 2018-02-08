import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import { reduxForm, Field } from 'redux-form'
import cx from 'classnames'
import { SIGNIN_USER_REQUEST, SIGNIN_USER_FAIL, REGISTER_USER_REQUEST, REGISTER_USER_FAIL } from 'containers/App/constants'
import messages from 'containers/HomePage/messages'
import Img from 'components/Img'
import LoadingSpinner from 'components/LoadingSpinner'
import RenderDropzone from 'components/RenderDropzone'
import RenderField from 'components/RenderField'
import { QuarterSpinner } from 'components/SvgIcon'
import { S3_ICON_URL, S3_USER_PROFILE_IMAGE_URL, S3_USER_HOLIDAY_IMAGE_URL } from 'utils/globalConstants'
import { imageUploader } from 'utils/imageHelper'
import authFormValidator from './validate'
import './style.scss'

class AuthForm extends Component {
  static propTypes = {
    signInUserRequest: PropTypes.func,
    registerUserRequest: PropTypes.func,
    onProfilePicChange: PropTypes.func,
    onHolidayPicChange: PropTypes.func,
    changeAuthMethod: PropTypes.func,
    handleSubmit: PropTypes.func,
    holidayPic: PropTypes.string,
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

    if (status !== info.status && (info.status === SIGNIN_USER_FAIL || info.status === REGISTER_USER_FAIL)) {
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
    const { signInUserRequest } = this.props
    const { email, password } = values
    this.setState({ email, password }, () => {
      signInUserRequest(values)
    })
  }

  handleRegister = values => {
    const { registerUserRequest } = this.props
    const { email, password, confirmPassword, fullname, profilePic, holidayPic } = values

    let data = {
      email,
      password,
      confirmPassword,
      fullname,
      profilePic: profilePic ? '' : this.props.profilePic,
      holidayPic: holidayPic ? '' : this.props.holidayPic,
    }

    if (!profilePic && !holidayPic) {
      registerUserRequest(data)
    } else {
      this.setState({ imageUpload: { uploading: true, error: false } })

      let cnt = 0
      if (profilePic) cnt += 1
      if (holidayPic) cnt += 1

      if (profilePic) {
        imageUploader(S3_USER_PROFILE_IMAGE_URL, profilePic, (err, url) => {
          if (err) {
            this.setState({
              imageUpload: { uploading: false, error: err.toString() },
            })
          } else {
            cnt -= 1
            data.profilePic = url

            if (cnt === 0) {
              registerRequest(data)
              this.setState({ imageUpload: { uploading: false, error: null } })
            }
          }
        })
      }

      if (holidayPic) {
        imageUploader(S3_USER_HOLIDAY_IMAGE_URL, holidayPic, (err, url) => {
          if (err) {
            this.setState({
              imageUpload: { uploading: false, error: err.toString() },
            })
          } else {
            cnt -= 1
            data.holidayPic = url

            if (cnt === 0) {
              registerRequest(data)
              this.setState({ imageUpload: { uploading: false, error: null } })
            }
          }
        })
      }
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
    const { info: { status, error, authMethod }, show, onProfilePicChange, onHolidayPicChange, handleSubmit, intl: { formatMessage } } = this.props

    const { formChanged, imageUpload } = this.state
    const spinnerShow = status === SIGNIN_USER_REQUEST || status === REGISTER_USER_REQUEST || imageUpload.uploading

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
            <Img src={`${S3_ICON_URL}/google.png`} />
            <span>Google</span>
          </GoogleLogin>
          <FacebookLogin
            appId="1088597931155576"
            fields="name,email,picture"
            callback={this.handleFacebookLogin}
            textButton="Facebook"
            icon={<Img src={`${S3_ICON_URL}/facebook.png`} />}
            autoLoad
          />
        </div>
        <div className="authForm__divider">
          <span>{formatMessage(messages.or)}</span>
        </div>
        <form onSubmit={handleSubmit(this.handleSubmit)} onChange={this.handleFormChange}>
          <Field name="email" type="email" component={RenderField} label={formatMessage(messages.email)} order={1} />
          <Field name="password" type="password" component={RenderField} label={formatMessage(messages.password)} order={2} />
          {authMethod === 'register' && (
            <div>
              <Field name="confirmPassword" type="password" component={RenderField} label={formatMessage(messages.repeatPassword)} order={2} />
              <Field name="fullname" type="text" component={RenderField} label={formatMessage(messages.fullname)} order={3} />
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
                  name="holidayPic"
                  label={formatMessage(messages.holidayPic)}
                  onChange={onHolidayPicChange}
                  component={RenderDropzone}
                  crop="landscape"
                />
              </div>
            </div>
          )}
          <div className="authForm__authButtons">
            <button className="authForm__authButton authForm__authButton--active">
              {authMethod === 'signIn' ? formatMessage(messages.signIn) : formatMessage(messages.register)}
            </button>
            <button className="authForm__authButton authForm__authButton--inactive" type="button" onClick={this.handleChangeAuthMethod}>
              {authMethod !== 'signIn' ? formatMessage(messages.signIn) : formatMessage(messages.register)}
            </button>
          </div>
          {!formChanged && error && (status === SIGNIN_USER_FAIL || status === REGISTER_USER_FAIL) && <div className="error">{formatMessage({ id: error })}</div>}
        </form>
      </div>
    )
  }
}

export default injectIntl(
  reduxForm({
    form: 'authForm',
    validate: authFormValidator,
  })(AuthForm)
)
