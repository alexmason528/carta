import React, { PropTypes } from 'react'

const EditButton = ({ className, image, onClick }) => (
  <button type="button" className={className} onClick={onClick}>
    <img src={`http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/${image}.png`} role="presentation" />
  </button>
)

EditButton.propTypes = {
  className: PropTypes.string,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default EditButton