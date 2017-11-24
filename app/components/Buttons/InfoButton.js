import React, { PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import Img from 'components/Img'

const InfoButton = ({ className, onClick }) => (
  <button className={className} onClick={onClick}>
    <Img src={`${CLOUDINARY_ICON_URL}/info.png`} />
  </button>
)

InfoButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default InfoButton
