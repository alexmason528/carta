import React, { Component, PropTypes } from 'react'
import { getTextFromDate } from 'utils/dateHelper'
import './style.scss'

const NormalPost = ({ img, title, author, created_at, content }) => {
  const { firstname, lastname } = author[0]

  return (
    <div className="normalPost">
      <div className="normalPost__image">
        <img src={img} role="presentation" />
        <h2>{title}</h2>
      </div>
      <div className="normalPost__info">
        {firstname} {lastname} - CARTA | {getTextFromDate(created_at)}
      </div>
      <p className="normalPost__content">
        {content}
      </p>
    </div>
  )
}

NormalPost.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.array,
  created_at: PropTypes.string,
  content: PropTypes.string,
}

export default NormalPost
