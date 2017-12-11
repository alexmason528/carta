import React, { PropTypes, Children } from 'react'
import cx from 'classnames'

const Button = ({ active, className, children, onClick }) => (
  <div className={cx({ section__btn: true, active, [className]: className })}>
    <button onClick={onClick}>{Children.toArray(children)}</button>
  </div>
)

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
}

export default Button
