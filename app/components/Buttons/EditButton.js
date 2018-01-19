import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'

export default class EditButton extends Component {
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
      <button type="button" className={cx({ postEditBtn: true, [className]: className })} onClick={onClick}>
        <Img src={`${S3_ICON_URL}/${image}.png`} />
        {white && <Img className="hover" src={`${S3_ICON_URL}/${image}.png`} />}
      </button>
    )
  }
}
