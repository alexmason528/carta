import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import className from 'classnames'
import { browserHistory } from 'react-router'
import { CLOUDINARY_COVER_URL } from 'containers/App/constants'
import './style.scss'

class StartQuest extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = { imageLoaded: false }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const quest = ReactDOM.findDOMNode(this)
    const width = $(quest).width()

    $(quest).find('h2').css({ fontSize: `${(width / 44) * 3 * 1.15}px` })
  }

  handleLoaded = (evt) => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  render() {
    const { imageLoaded } = this.state
    const { authenticated } = this.props
    const questClass = className({
      startQuest: true,
      startQuest__authenticated: authenticated,
      hidden: !imageLoaded,
    })

    return (
      <div className={questClass} onClick={() => browserHistory.push('/quest')}>
        <img className="startQuest__hoverImg" onLoad={this.handleLoaded} src={`${CLOUDINARY_COVER_URL}/quest.jpg`} role="presentation" />
        <img src={`${CLOUDINARY_COVER_URL}/quest.jpg`} role="presentation" />
        <h2>Begin je<br />persoonlijke <br />zoektocht</h2>
      </div>
    )
  }
}

export default StartQuest
