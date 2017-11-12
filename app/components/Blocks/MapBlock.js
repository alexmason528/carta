import React, { PropTypes, Children } from 'react'
import './style.scss'

const MapBlock = ({ className, children }) => (
  <div className={className}>
    {Children.toArray(children)}
  </div>
)

MapBlock.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default MapBlock
