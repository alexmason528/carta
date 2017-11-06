import React, { PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

const InfoButton = ({ className, onClick }) => (
  <button className={className} onClick={onClick}>
    <img src={`${CLOUDINARY_ICON_URL}/info.png`} role="presentation" />
  </button>
)

InfoButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default InfoButton
