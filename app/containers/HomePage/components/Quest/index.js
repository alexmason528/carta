import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import className from 'classnames'
import './style.scss'

const Quest = ({ authenticated }) => {
  const questClass = className({
    quest: true,
    quest__Authenticated: authenticated,
  })

  return (
    <div className={questClass}>
      <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/quest/start/1.jpg" role="presentation" />
      <h2>Start your personal quest</h2>
    </div>
  )
}

Quest.propTypes = {
  authenticated: PropTypes.bool,
}

export default Quest
