import React, { PropTypes } from 'react'
import './style.scss'

const LoadingSpinner = props => {
  const { show } = props

  if (!show) return null;
  return (
    <div className="loader">
      {props.children}
    </div>
  )
}

LoadingSpinner.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

LoadingSpinner.defaultProps = {
  show: true,
}

export default LoadingSpinner
