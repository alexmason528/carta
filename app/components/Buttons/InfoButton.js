import React, { PropTypes } from 'react'

const InfoButton = ({ className, onClick }) => (
  <button className={className} onClick={onClick}>
    <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/info.png" role="presentation" />
  </button>
)

InfoButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default InfoButton
