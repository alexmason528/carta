import React, { PropTypes, Children } from 'react'
import './style.scss'

const MapBlock = props => {
  return (
    <div className={props.className}>
      {Children.toArray(props.children)}
    </div>
  )
}

const ScoreBoardBlock = props => {
  return (
    <div className="scoreboard-block">
      {Children.toArray(props.children)}
    </div>
  )
}

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
