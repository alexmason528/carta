import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import className from 'classnames'
import './style.scss'

export default class ImagePost extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showInfo: false,
    }
  }

  componentDidMount() {
    const interval =
    setInterval(() => {
      const imagePost = ReactDOM.findDOMNode(this)
      if ($(imagePost).height() > 0) {
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
    const imagePost = ReactDOM.findDOMNode(this)
    const postWidth = $(imagePost).width()
    const winWidth = $(window).width()

    let fontSize
    if (winWidth > 1000) {
      fontSize = postWidth / 19
    } else if (winWidth > 550) {
      fontSize = postWidth / 11
    } else {
      fontSize = postWidth / 11
    }

    $(imagePost).find('h2').css('font-size', `${fontSize}px`)

    let postHeight = $(imagePost).outerHeight()
    let headerHeight = $(imagePost).find('h2').outerHeight()

    $(imagePost).find('h2').css('bottom', `${(postHeight - headerHeight) / 2}px`)
  }

  toggleInfo = (evt) => {
    evt.stopPropagation()

    this.setState({
      showInfo: !this.state.showInfo,
    })
  }

  hideInfo = () => {
    this.setState({
      showInfo: false,
    })
  }

  render() {
    const { showInfo } = this.state
    const postInfoClass = className({
      imagePost__info: true,
      'imagePost__info--hidden': !showInfo,
    })

    const { imageUrl, title, username, date } = this.props

    return (
      <div className="imagePost" onClick={this.hideInfo}>
        <img src={imageUrl} role="presentation" />
        <h2>{title}</h2>
        <button className="imagePost__infoBtn" onClick={this.toggleInfo}>
          <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/info.png" role="presentation" />
        </button>
        <div className={postInfoClass}>
          {username} - Carta | {date}
        </div>
      </div>
    )
  }
}

ImagePost.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  username: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  date: PropTypes.string,
}