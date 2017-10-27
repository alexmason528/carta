import React, { PropTypes } from 'react'

const DeleteButton = ({ className, showConfirm, onClick, onConfirm }) => (
  <div className={className} onClick={onClick}>
    <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/trash.png" role="presentation" />
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
