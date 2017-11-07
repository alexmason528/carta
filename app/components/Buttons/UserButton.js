import React, { Component, PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

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
        <img src={`${CLOUDINARY_ICON_URL}/user-white-shadow.png`} role="presentation" />
        <img className="hover" src={`${CLOUDINARY_ICON_URL}/user-white-shadow.png`} role="presentation" />
      </button>
    )
  }
}
