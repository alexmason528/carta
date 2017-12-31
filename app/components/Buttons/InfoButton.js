import React, { PropTypes } from 'react'
import cx from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import Img from 'components/Img'

const InfoButton = ({ className, active, onClick }) => (
  <button
    className={cx({ postInfoBtn: true, [className]: className, active })}
    onClick={onClick}
  >
    <Img src={`${CLOUDINARY_ICON_URL}/info.png`} />
  </button>
)

InfoButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  active: PropTypes.bool,
}

export default InfoButton
