import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import Img from 'components/Img'

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
      <button className={cx({ profile__userButton: true, [className]: className })} onClick={this.handleClick}>
        <Img src={`${CLOUDINARY_ICON_URL}/user-white-shadow.png`} />
        <Img className="hover" src={`${CLOUDINARY_ICON_URL}/user-white-shadow.png`} />
      </button>
    )
  }
}
