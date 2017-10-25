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
    console.log(suggestion)

    const interval =
    setInterval(() => {
      if ($(suggestion).height() > 100) {
        this.setState({
          initialized: true,
        })
        clearInterval(interval)
      }
    }, 0)
  }

  render() {
    const { imageUrl, title } = this.props
    const { initialized } = this.state

    return (
      <div className="suggestion">
        <img src={imageUrl} role="presentation" />
        <h2>{title}</h2>
      </div>
    )
  }
}

export default Suggestion
