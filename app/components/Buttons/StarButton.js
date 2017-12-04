import React, { PropTypes, Children } from 'react'
import cx from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import Img from 'components/Img'

const StarButton = ({ star, active, className, children, onStarClick, onMouseDown }) => (
  <div className={cx({ 'button-wrapper': true, star, active, [className]: className })}>
    <button onMouseDown={onMouseDown}>{Children.toArray(children)}</button>
    <Img className="star" src={`${CLOUDINARY_ICON_URL}/star-green.png`} onClick={onStarClick} />
  </div>
)

StarButton.propTypes = {
  onMouseDown: PropTypes.func,
  onStarClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  star: PropTypes.bool,
  className: PropTypes.string,
}

export default StarButton
