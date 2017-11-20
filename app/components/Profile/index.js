import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { injectIntl, intlShape } from 'react-intl'
import axios from 'axios'
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET, UPDATE_USER_REQUEST } from 'containers/App/constants'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { UserButton } from 'components/Buttons'
import { getCroppedImage } from 'utils/imageHelper'
import messages from 'containers/HomePage/messages'
import './style.scss'

class Profile extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    onUpdate: PropTypes.func,
    authenticated: PropTypes.bool,
    user: PropTypes.object,
    info: PropTypes.object,
    coverPic: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    profilePic: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      profilePic: null,
      coverPic: null,
      imageType: null,
      imageLoaded: false,
      imageUpload: {
        uploading: false,
        error: null,
      },
    }
  }
  componentWillMount() {
    const { profilePic, coverPic } = this.props
    this.setState({ profilePic, coverPic })
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillReceiveProps(nextProps) {
    const { profilePic, coverPic } = this.props
    if (profilePic !== nextProps.profilePic) {
      this.setState({ profilePic: null }, () => {
        this.setState({ profilePic: nextProps.profilePic })
      })
    }

    if (coverPic !== nextProps.coverPic) {
      this.setState({ coverPic: null }, () => {
        this.setState({ coverPic: nextProps.coverPic })
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const profile = ReactDOM.findDOMNode(this)
    const width = $(profile).width()

    $(profile).find('h2').css({ fontSize: `${(width / 44) * 3 * 1.15}px` })
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  handleCoverImg = () => {
    const { authenticated } = this.props
    if (authenticated) {
      this.setState({ imageType: 'coverPic' })
      this.mediaUploader.click()
    }
  }

  handleProfilePic = evt => {
    evt.stopPropagation()
    const { authenticated } = this.props
    if (authenticated) {
      this.setState({ imageType: 'profilePic' })
      this.mediaUploader.click()
    }
  }

  handleFiles = evt => {
    const file = evt.target.files[0]
    const { imageType } = this.state
    getCroppedImage(file, this.handleImage, (imageType === 'profilePic') ? 'portrait' : 'landscape')
  }

  handleImage = (img, type) => {
    const { imageType } = this.state
    const { onUpdate } = this.props

    this.setState({ imageUpload: { uploading: true, error: null } })

    let formData = new FormData()
    formData.append('file', img)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then(res => {
      const { data: { url } } = res
      this.setState({ imageUpload: { uploading: false, error: null } })
      onUpdate({ [imageType]: url })
    }).catch(err => {
      this.setState({ imageUpload: { uploading: false, error: err.toString() } })
    })
  }

  render() {
    const { authenticated, user, onClick, info: { status, error }, intl: { formatMessage } } = this.props
    const { coverPic, profilePic, imageUpload, imageType, imageLoaded } = this.state
    const coverPicSpinner = imageType === 'coverPic' && (imageUpload.uploading || status === UPDATE_USER_REQUEST)
    const profilePicSpinner = imageType === 'profilePic' && (imageUpload.uploading || status === UPDATE_USER_REQUEST)

    return (
      <div className="profile">
        { coverPic &&
          <div className="coverPic" onClick={authenticated ? this.handleCoverImg : onClick}>
            <LoadingSpinner show={coverPicSpinner}>
              <QuarterSpinner width={30} height={30} />
            </LoadingSpinner>
            <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
            <img className="coverPic__hoverImg" onLoad={this.handleLoaded} src={coverPic} role="presentation" />
            <img src={coverPic} role="presentation" />
            { authenticated ? <h2>{user.fullname}</h2> : <h2 onClick={onClick}>{formatMessage(messages.signIn)}</h2> }
            { authenticated && <UserButton className="profile__userButton" onClick={onClick} /> }
          </div>
        }
        { profilePic &&
          <div className="profilePic" onClick={authenticated ? this.handleProfilePic : onClick}>
            <LoadingSpinner show={profilePicSpinner}>
              <QuarterSpinner width={30} height={30} />
            </LoadingSpinner>
            <img src={profilePic} role="presentation" />
          </div>
        }
      </div>
    )
  }
}

export default injectIntl(Profile)
