import React, { PropTypes } from 'react'

const UserButton = ({ className, onClick }) => (
  <button className={className} onClick={onClick}>
    <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/user-white-shadow.png" role="presentation" />
  </button>
)

UserButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
}

export default UserButton
