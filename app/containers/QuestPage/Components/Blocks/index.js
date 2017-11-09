import React, { PropTypes, Children } from 'react'
import './style.scss'

const MapBlock = ({ className, children }) => (
  <div className={className}>
    {Children.toArray(children)}
  </div>
)

const ScoreBoardBlock = ({ children }) => (
  <div className="scoreboard-block">
    {Children.toArray(children)}
  </div>
)

MapBlock.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string.isRequired,
}

ScoreBoardBlock.propTypes = {
  children: PropTypes.node,
}

export {
  MapBlock,
  ScoreBoardBlock,
}
