import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { injectIntl, intlShape } from 'react-intl'
import { browserHistory } from 'react-router'
import { UPDATE_USER_REQUEST } from 'containers/App/constants'
import messages from 'containers/HomePage/messages'
import { UserButton } from 'components/Buttons'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import Img from 'components/Img'
import { S3_PLACE_URL, S3_USER_PROFILE_IMAGE_URL } from 'utils/globalConstants'
import { getCroppedImage, imageUploader } from 'utils/imageHelper'
import { getFirstname } from 'utils/stringHelper'
import './style.scss'

class Profile extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    onUpdate: PropTypes.func,
    authenticated: PropTypes.bool,
    user: PropTypes.object,
    info: PropTypes.object,
    profilePic: PropTypes.string,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      profilePic: null,
      imageType: null,
      imageLoaded: false,
      imageUpload: {
        uploading: false,
        error: null,
      },
    }

    this.coverPic = Math.floor(Math.random() * 4)
    this.placeList = [
      { name: 'amsterdam', link: 'amsterdam' },
      { name: 'rotterdam', link: 'rotterdam' },
      { name: 'utrecht', link: 'utrecht-province' },
      { name: 'gelderland', link: 'gelderland' },
    ]
  }
  componentWillMount() {
    const { profilePic } = this.props
    this.setState({ profilePic })
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillReceiveProps(nextProps) {
    const { profilePic } = this.props
    if (profilePic !== nextProps.profilePic) {
      this.setState({ profilePic: null }, () => {
        this.setState({ profilePic: nextProps.profilePic })
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const profile = ReactDOM.findDOMNode(this)
    const width = $(profile).width()

    $(profile)
      .find('h2')
      .css({ fontSize: `${width / 44 * 3 * 1.15}px` })
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
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
    getCroppedImage(file, this.handleImage, 'portrait')
  }

  handleImage = img => {
    const { onUpdate } = this.props

    this.setState({ imageUpload: { uploading: true, error: null } })

    imageUploader(S3_USER_PROFILE_IMAGE_URL, img, (err, url) => {
      if (err) {
        this.setState({
          imageUpload: { uploading: false, error: err.toString() },
        })
      } else {
        onUpdate({ profilePic: url })
        this.setState({ imageUpload: { uploading: false, error: null } })
      }
    })
  }

  handlePlaceInfoBtnClick = (evt, place) => {
    evt.stopPropagation()
    browserHistory.push(`/in/${place}`)
  }

  handleCoverPicClick = evt => {
    const { authenticated, onClick } = this.props
    if (authenticated) {
      this.handlePlaceInfoBtnClick(evt, this.placeList[this.coverPic].link)
    } else {
      onClick(evt)
    }
  }

  render() {
    const { authenticated, user, onClick, info: { status }, intl: { formatMessage } } = this.props
    const { profilePic, imageUpload, imageType } = this.state
    const profilePicSpinner = imageType === 'profilePic' && (imageUpload.uploading || status === UPDATE_USER_REQUEST)

    return (
      <div className="profile Mb-8 P-R">
        <div className="profile__menu">
          <button className="profile__placeInfoBtn Tt-U Fw-B Fz-10" onClick={evt => this.handlePlaceInfoBtnClick(evt, this.placeList[this.coverPic].link)}>
            {this.placeList[this.coverPic].name}
          </button>{' '}
          |{' '}
          <button
            className="Tt-U Fw-B Fz-10"
            onClick={() => {
              browserHistory.push('/places')
            }}
          >
            {formatMessage(messages.browsePlaces)}
          </button>
        </div>
        <div className="profile__content">
          <div className="coverPic Cr-P Ov-H P-R" onClick={this.handleCoverPicClick}>
            <Img onLoad={this.handleLoaded} src={`${S3_PLACE_URL}/wide/${this.placeList[this.coverPic].name}.jpg`} />
          </div>
        </div>
        {authenticated ? (
          <h2 className="Mb-0 Tt-U P-A">{getFirstname(user.fullname)}</h2>
        ) : (
          <h2 className="Mb-0 Tt-U P-A" onClick={onClick}>
            {formatMessage(messages.signIn)}
          </h2>
        )}
        {authenticated && <UserButton className="P-A" onClick={onClick} />}
        {profilePic && (
          <div className="profilePic Ov-H" onClick={authenticated ? this.handleProfilePic : onClick}>
            <LoadingSpinner show={profilePicSpinner}>
              <QuarterSpinner width={30} height={30} />
            </LoadingSpinner>
            <Img src={profilePic} />
          </div>
        )}
        <input
          type="file"
          ref={ref => {
            this.mediaUploader = ref
          }}
          accept="image/*"
          onChange={this.handleFiles}
        />
      </div>
    )
  }
}

export default injectIntl(Profile)
