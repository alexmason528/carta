import React, { PropTypes } from 'react'

const DeleteButton = ({ className, onClick }) => (
  <div className={className} onClick={onClick}>
    <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/trash.png" role="presentation" />
  </div>
)

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default DeleteButton
