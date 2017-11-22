import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import ReactDOM from 'react-dom'

import './style.scss'

class Suggestion extends Component {
  static propTypes = {
    img: PropTypes.string,
    title: PropTypes.string,
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
    const suggestion = ReactDOM.findDOMNode(this)
    const width = $(suggestion).width()
    $(suggestion).find('h2').css({ fontSize: `${(width / 44) * 3 * 1.15}px` })
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  render() {
    const { img, title } = this.props
    const { imageLoaded } = this.state

    return (
      <div className={cx({ suggestion: true, hidden: !imageLoaded })}>
        <img onLoad={this.handleLoaded} src={img} role="presentation" />
        <h2>{title}</h2>
      </div>
    )
  }
}

export default Suggestion
