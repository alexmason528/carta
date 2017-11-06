import React, { PropTypes, Children } from 'react'
import classNames from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

const Button = props => {
  let btnClass = classNames({
    'button-wrapper': true,
    active: props.active === 1,
  })

  if (props.className) btnClass = `${btnClass} ${props.className}`

  return (
    <div className={btnClass}>
      <button onClick={props.onClick}>{Children.toArray(props.children)}</button>
    </div>
  )
}

const StarButton = props => {
  let btnClass = classNames({
    'button-wrapper': true,
    star: props.star === 1,
    active: props.active === 1,
  })

  if (props.className) btnClass = `${btnClass} ${props.className}`

  return (
    <div className={btnClass}>
      <button onMouseDown={props.onMouseDown}>{Children.toArray(props.children)}</button>
      <img className="star" src={`${CLOUDINARY_ICON_URL}/star-green.png`} onClick={props.onStarClick} role="presentation" />
    </div>
  )
}

const QuestButton = props => {
  return (
    <div className={props.className}>
      <div onClick={props.onClick}>
        <img src={`${CLOUDINARY_ICON_URL}/search.png`} className="inactive" role="presentation" />
        <img src={`${CLOUDINARY_ICON_URL}/search-blue.png`} className="active" role="presentation" />
      </div>
      <span onClick={props.onCloseClick}>
        <img src={`${CLOUDINARY_ICON_URL}/close.png`} role="presentation" />
      </span>
    </div>
  )
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.number,
  className: PropTypes.string,
}

StarButton.propTypes = {
  onMouseDown: PropTypes.func,
  onStarClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.number,
  star: PropTypes.number,
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
