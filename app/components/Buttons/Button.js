import React, { PropTypes, Children } from 'react'
import classNames from 'classnames'

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

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
}

export default Button
