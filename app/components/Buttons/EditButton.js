import React, { Component, PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

export default class EditButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    image: PropTypes.string.isRequired,
  }

  handleClick = evt => {
    const { onClick } = this.props
    evt.stopPropagation()
    onClick()
  }

  render() {
    const { className, image } = this.props
    return (
      <button type="button" className={className} onClick={this.handleClick}>
        <img src={`${CLOUDINARY_ICON_URL}/${image}.png`} role="presentation" />
      </button>
    )
  }
}
