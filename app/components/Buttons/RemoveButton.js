import React, { PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

const RemoveButton = ({ className, image, caption, hover, onClick }) => (
  <button type="button" className={className} onClick={onClick}>
    <img src={`${CLOUDINARY_ICON_URL}/${image}.png`} role="presentation" />
    { hover && <img className="hover" src={`${CLOUDINARY_ICON_URL}/${image}.png`} role="presentation" /> }
    { caption && <span>{caption}</span>}
  </button>
)

RemoveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  image: PropTypes.string.isRequired,
  caption: PropTypes.string,
  hover: PropTypes.bool,
}

export default RemoveButton
