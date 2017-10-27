import React, { PropTypes } from 'react'

const EditButton = ({ className, image, onClick }) => (
  <button type="button" className={className} onClick={onClick}>
    <img src={`https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/${image}.png`} role="presentation" />
  </button>
)

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  image: PropTypes.string.isRequired,
}

export default EditButton
