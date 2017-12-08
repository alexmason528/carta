import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import { COLORS } from 'containers/App/constants'
import './style.scss'

class ScoreBoard extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    recommendations: PropTypes.array,
    show: PropTypes.bool,
  }

  render() {
    const { recommendations, show } = this.props
    return (
      <div className={cx({ scoreboard: true, hidden: !show })}>
        {
          recommendations.map((recommendation, index) => {
            const { name, score } = recommendation
            return <div key={index} style={{ color: COLORS[index % 5] }}>{name} : {score}</div>
          })
        }
      </div>
    )
  }
}

export default ScoreBoard
