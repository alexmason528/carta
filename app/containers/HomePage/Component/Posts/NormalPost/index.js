import React, { Component, PropTypes } from 'react'
import './style.scss'

const NormalPost = ({ imageUrl, title, username, date, content }) => {
  return (
    <div className="normalPost">
      <div className="normalPost__image">
        <img src={imageUrl} role="presentation" />
        <h2>{title}</h2>
      </div>
      <div className="normalPost__info">
        {username} - CARTA | {date}
      </div>
      <p className="normalPost__content">
        {content}
      </p>
    </div>
  )
}

NormalPost.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  username: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  date: PropTypes.string,
  content: PropTypes.string,
}

export default NormalPost
