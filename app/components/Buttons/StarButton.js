import React, { PropTypes, Children } from 'react'
import classNames from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

const StarButton = props => {
  const { star, active, className, children, onStarClick, onMouseDown } = props
  let btnClass = classNames({
    'button-wrapper': true,
    star,
    active,
  })

  if (className) btnClass = `${btnClass} ${className}`

  return (
    <div className={btnClass}>
      <button onMouseDown={onMouseDown}>{Children.toArray(children)}</button>
      <img className="star" src={`${CLOUDINARY_ICON_URL}/star-green.png`} onClick={onStarClick} role="presentation" />
    </div>
  )
}

StarButton.propTypes = {
  onMouseDown: PropTypes.func,
  onStarClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  star: PropTypes.bool,
  className: PropTypes.string,
}

export default StarButton
