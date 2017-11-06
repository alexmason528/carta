import React, { PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

const DeleteButton = ({ className, onClick }) => (
  <div className={className} onClick={onClick}>
    <img src={`${CLOUDINARY_ICON_URL}/delete.png`} role="presentation" />
  </div>
)

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default DeleteButton
