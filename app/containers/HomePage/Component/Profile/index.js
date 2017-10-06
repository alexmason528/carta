import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import './style.scss'

class Profile extends Component {

  componentWillMount() {
    let rand = Math.floor((Math.random() * 76)) + 1
    this.coverImgRand = (rand < 10) ? `000${rand}` : `00${rand}`;
    this.profilePicRand = Math.floor((Math.random() * 9))
  }

  componentDidMount() {
    const interval =
    setInterval(() => {
      const profile = ReactDOM.findDOMNode(this)
      if ($(profile).height() > 0) {
        clearInterval(interval)
        this.handleResize()
      }
    })
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const profile = ReactDOM.findDOMNode(this)
    const profilePic = $(profile).find('.profile__pic')

    const height = $(profilePic).outerHeight()
    $(profilePic).css('bottom', `-${height / 2}px`)
  }

  render() {
    const { authenticated, user } = this.props
    const username = (authenticated) ? `${user.firstname} ${user.lastname}` : 'Sign in'
    const coverImg = (authenticated && user.cover_img) ? user.cover_img : `http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/wide/${this.coverImgRand}.jpg`
    const profileImg = (authenticated && user.profile_pic) ? user.profile_pic : `http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/profile/bag/${this.profilePicRand}.jpg`

    return (
      <div className="profile" onClick={this.props.onClick}>
        <img src={coverImg} role="presentation" />
        <div className="profile__pic">
          <img src={profileImg} role="presentation" />
        </div>
        <h2>{username}</h2>
      </div>
    )
  }
}

Profile.propTypes = {
  onClick: PropTypes.func,
  authenticated: PropTypes.bool,
  user: PropTypes.object,
}

export default Profile
