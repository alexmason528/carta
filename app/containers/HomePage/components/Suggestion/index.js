import React, { Component, PropTypes } from 'react'
import className from 'classnames'
import ReactDOM from 'react-dom'

import './style.scss'

class Suggestion extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    title: PropTypes.string,
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
    const suggestion = ReactDOM.findDOMNode(this)
    const width = $(suggestion).width()

    $(suggestion).find('h2').css({ fontSize: `${(width / 44) * 3 * 1.15}px` })
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  render() {
    const { imageUrl, title } = this.props
    const { imageLoaded } = this.state
    const suggestionClass = className({
      suggestion: true,
      hidden: !imageLoaded,
    })

    return (
      <div className={suggestionClass}>
        <img onLoad={this.handleLoaded} src={imageUrl} role="presentation" />
        <h2>{title}</h2>
      </div>
    )
  }
}

export default Suggestion
