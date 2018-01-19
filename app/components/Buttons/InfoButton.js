import React, { PropTypes } from 'react'
import cx from 'classnames'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'

const InfoButton = ({ className, active, onClick }) => (
  <button className={cx({ postInfoBtn: true, [className]: className, active })} onClick={onClick}>
    <Img src={`${S3_ICON_URL}/info.png`} />
  </button>
)

InfoButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  active: PropTypes.bool,
}

export default InfoButton
