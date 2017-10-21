import React, { PropTypes } from 'react'

const RemoveButton = ({ className, image, caption, onClick }) => (
  <button type="button" className={className} onClick={onClick}>
    <img src={`http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/${image}.png`} role="presentation" />
    { caption && <span>{caption}</span>}
  </button>
)

RemoveButton.propTypes = {
  className: PropTypes.string,
  image: PropTypes.string.isRequired,
  caption: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default RemoveButton
