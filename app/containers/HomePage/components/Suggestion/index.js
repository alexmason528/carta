import React, { Component, PropTypes } from 'react'
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
      initialized: false,
    }
  }

  componentDidMount() {
    const suggestion = ReactDOM.findDOMNode(this)

    const interval =
    setInterval(() => {
      if ($(suggestion).height() > 100) {
        this.setState({
          initialized: true,
        })
        this.handleResize()
        clearInterval(interval)
      }
    }, 0)

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const suggestion = ReactDOM.findDOMNode(this)
    const width = $(suggestion).width()

    $(suggestion).find('h2').css({ fontSize: `${width / 11}px` })
  }

  render() {
    const { imageUrl, title } = this.props
    const { initialized } = this.state

    return (
      <div className="suggestion" style={{ display: initialized ? 'block' : 'none' }}>
        <img src={imageUrl} role="presentation" />
        <h2>{title}</h2>
      </div>
    )
  }
}

export default Suggestion
