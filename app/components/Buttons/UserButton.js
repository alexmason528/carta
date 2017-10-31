import React, { Component, PropTypes } from 'react'

export default class UserButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
  }

  handleClick = evt => {
    const { onClick } = this.props
    evt.stopPropagation()
    onClick()
  }

  render() {
    const { className } = this.props
    return (
      <button className={className} onClick={this.handleClick}>
        <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/user-white-shadow.png" role="presentation" />
      </button>
    )
  }
}
