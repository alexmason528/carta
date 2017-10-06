import React, { Component, PropTypes } from 'react'
import './style.scss'

const Suggestion = ({ imageUrl, title }) => {
  return (
    <div className="suggestion">
      <img src={imageUrl} role="presentation" />
      <h2>{title}</h2>
    </div>
  )
}

Suggestion.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
}

export default Suggestion
