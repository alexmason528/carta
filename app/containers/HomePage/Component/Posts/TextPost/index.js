import React, { Component, PropTypes } from 'react'
import className from 'classnames'
import { getTextFromDate } from 'utils/dateHelper'
import './style.scss'

const TextPost = ({ title, author, created_at, content, first, editable }) => {
  const { firstname, lastname } = author[0]
  const postClass = className({
    textPost: true,
    'textPost--first': !!first,
  })

  return (
    <div className={postClass}>
      <div className="textPost__title">
        {title}
      </div>
      <div className="textPost__info">
        {firstname} {lastname} - CARTA | {getTextFromDate(created_at)}
      </div>
      <p className="textPost__content">
        {content}
      </p>
    </div>
  )
}

TextPost.propTypes = {
  title: PropTypes.string,
  author: PropTypes.array,
  created_at: PropTypes.string,
  content: PropTypes.string,
  first: PropTypes.bool,
  editable: PropTypes.bool,
}

export default TextPost
