import React, { PropTypes } from 'react'

const LinkButton = ({ className, onClick }) => (
  <button type="button" className={className} onClick={onClick}>
    <div className="btnImage">
      <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784802/image/icon/link.png" role="presentation" />
    </div>
    <div className="btnText">Link</div>
  </button>
)

LinkButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default LinkButton
