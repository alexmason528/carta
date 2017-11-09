import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import className from 'classnames'
import { browserHistory } from 'react-router'
import { CLOUDINARY_COVER_URL } from 'containers/App/constants'
import './style.scss'

class Quest extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      imageLoaded: false,
    }
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
      quest: true,
      quest__authenticated: authenticated,
      hidden: !imageLoaded,
    })

    return (
      <div className={questClass} onClick={() => browserHistory.push('/quest')}>
        <img onLoad={this.handleLoaded} src={`${CLOUDINARY_COVER_URL}/quest.jpg`} role="presentation" />
        <h2>Start<br />your<br />personal<br />quest</h2>
      </div>
    )
  }
}

export default Quest
