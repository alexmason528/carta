import React, { PropTypes } from 'react'

const RemoveButton = ({ className, image, caption, onClick }) => (
  <button type="button" className={className} onClick={onClick}>
    <img src={`https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/${image}.png`} role="presentation" />
    { caption && <span>{caption}</span>}
  </button>
)

RemoveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  image: PropTypes.string.isRequired,
  caption: PropTypes.string,
}

export default RemoveButton
