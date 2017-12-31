import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import Img from 'components/Img'

export default class EditButton extends Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    hover: PropTypes.bool,
    white: PropTypes.bool,
  }

  render() {
    const { white, onClick, className } = this.props
    const image = white ? 'edit-white-shadow' : 'edit'

    return (
      <button
        type="button"
        className={cx({ postEditBtn: true, [className]: className })}
        onClick={onClick}
      >
        <Img src={`${CLOUDINARY_ICON_URL}/${image}.png`} />
        {white && (
          <Img className="hover" src={`${CLOUDINARY_ICON_URL}/${image}.png`} />
        )}
      </button>
    )
  }
}
