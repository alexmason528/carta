import React, { PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

const LinkButton = ({ className, onClick }) => (
  <button type="button" className={className} onClick={onClick}>
    <div className="btnImage">
      <img src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
    </div>
    <div className="btnText">Link</div>
  </button>
)

LinkButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default LinkButton
