import React, { PropTypes, Children } from 'react'
import './style.scss'

const ScoreBoardBlock = ({ children }) => (
  <div className="scoreboard-block">
    {Children.toArray(children)}
  </div>
)

ScoreBoardBlock.propTypes = {
  children: PropTypes.node,
}

export default ScoreBoardBlock
