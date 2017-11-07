import React, { PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

const DeleteButton = ({ className, showConfirm, onClick, onConfirm }) => (
  <div className={className} onClick={onClick}>
    <img src={`${CLOUDINARY_ICON_URL}/delete.png`} role="presentation" />
    <div className="popOver" style={{ display: showConfirm ? 'block' : 'none' }}>
      <button type="button" onClick={onConfirm}>SURE?</button>
    </div>
  </div>
)

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  className: PropTypes.string,
  showConfirm: PropTypes.bool,
}

export default DeleteButton
