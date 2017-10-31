import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { UserButton } from 'components/Buttons'
import './style.scss'

export default class Profile extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    onUpdateCoverImg: PropTypes.func,
    onUpdateProfilePic: PropTypes.func,
    authenticated: PropTypes.bool,
    user: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      initialized: false,
      imageType: null,
    }
  }

  componentWillMount() {
    let rand = Math.floor((Math.random() * 76)) + 1
    this.coverImgRand = (rand < 10) ? `000${rand}` : `00${rand}`;
    this.profilePicRand = Math.floor((Math.random() * 9))
  }

  componentDidMount() {
    const profile = ReactDOM.findDOMNode(this)

    const interval =
    setInterval(() => {
      if ($(profile).height() > 100) {
        this.setState({
          initialized: true,
        })
        clearInterval(interval)
      }
    }, 0)
  }

  handleProfileClick = (evt, imageType) => {
    evt.stopPropagation()

    const { authenticated } = this.props
    if (authenticated) {
      this.setState({
        imageType,
      })
      // this.mediaUploader.click()
    }
  }

  handleFiles = evt => {
    const { onUpdateCoverImg, onUpdateProfilePic } = this.props
    const { imageType } = this.state

    if (evt.target.files.length > 0) {
      let formData = new FormData()
      formData.append(imageType, evt.target.files[0])

      // if (imageType === 'cover_img') {
      //   onUpdateCoverImg(formData)
      // } else if (imageType === 'profile_pic') {
      //   onUpdateProfilePic(formData)
      // }
    }
  }

  render() {
    const { authenticated, user, onClick } = this.props
    const { initialized } = this.state
    const fullname = (authenticated) ? `${user.fullname}` : 'Sign in'
    const coverImg = (authenticated && user.cover_img) ? user.cover_img : `https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/wide/${this.coverImgRand}.jpg`
    const profileImg = (authenticated && user.profile_pic) ? user.profile_pic : `https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/profile/bag/${this.profilePicRand}.jpg`

    return (
      <div className="profile" style={{ display: initialized ? 'block' : 'none' }} onClick={evt => this.handleProfileClick(evt, 'cover_img')}>
        <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
        <img src={coverImg} role="presentation" />
        <div className="profile__pic" onClick={evt => this.handleProfileClick(evt, 'profile_pic')}>
          <img src={profileImg} role="presentation" />
        </div>
        { authenticated && <UserButton className="profile__userButton" onClick={onClick} /> }
        { !authenticated ? <h2 onClick={onClick}>{fullname}</h2> : <h2>{fullname}</h2> }
      </div>
    )
  }
}
