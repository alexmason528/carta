import React, { PropTypes, Children } from 'react'
import classNames from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

const Button = props => {
  const { active, className, children, onClick } = props
  let btnClass = classNames({
    'button-wrapper': true,
    active,
  })

  if (className) btnClass = `${btnClass} ${className}`

  return (
    <div className={btnClass}>
      <button onClick={onClick}>{Children.toArray(children)}</button>
    </div>
  )
}

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

const QuestButton = ({ className, onClick, onCloseClick }) => (
  <div className={className}>
    <div onClick={onClick}>
      <img src={`${CLOUDINARY_ICON_URL}/search.png`} className="inactive" role="presentation" />
      <img src={`${CLOUDINARY_ICON_URL}/search-blue.png`} className="active" role="presentation" />
    </div>
    <span onClick={onCloseClick}>
      <img src={`${CLOUDINARY_ICON_URL}/close.png`} role="presentation" />
    </span>
  </div>
)

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
}

StarButton.propTypes = {
  onMouseDown: PropTypes.func,
  onStarClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  star: PropTypes.bool,
  className: PropTypes.string,
}

QuestButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  onCloseClick: PropTypes.func,
}

export {
  Button,
  StarButton,
  QuestButton,
}
