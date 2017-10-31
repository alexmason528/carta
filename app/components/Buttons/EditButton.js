import React, { Component, PropTypes } from 'react'

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
        <img src={`https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/${image}.png`} role="presentation" />
      </button>
    )
  }
}
