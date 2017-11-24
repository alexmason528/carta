import React, { PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import Img from 'components/Img'

const RemoveButton = ({ className, image, children, hover, onClick }) => (
  <button type="button" className={className} onClick={onClick}>
    <Img src={`${CLOUDINARY_ICON_URL}/${image}.png`} />
    { hover && <Img className="hover" src={`${CLOUDINARY_ICON_URL}/${image}.png`} /> }
    { children }
  </button>
)

RemoveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node,
  hover: PropTypes.bool,
}

export default RemoveButton
