import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { UserButton } from 'components/Buttons'
import './style.scss'

export default class Profile extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    authenticated: PropTypes.bool,
    user: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      initialized: false,
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

  render() {
    const { authenticated, user, onClick } = this.props
    const { initialized } = this.state
    const username = (authenticated) ? `${user.fullname}` : 'Sign in'
    const coverImg = (authenticated && user.cover_img) ? user.cover_img : `https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/wide/${this.coverImgRand}.jpg`
    const profileImg = (authenticated && user.profile_pic) ? user.profile_pic : `https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/profile/bag/${this.profilePicRand}.jpg`

    return (
      <div className="profile" style={{ display: initialized ? 'block' : 'none' }}>
        <img src={coverImg} role="presentation" />
        <div className="profile__pic">
          <img src={profileImg} role="presentation" />
        </div>
        <UserButton className="profile__userButton" onClick={onClick} />
        <h2>{username}</h2>
      </div>
    )
  }
}
