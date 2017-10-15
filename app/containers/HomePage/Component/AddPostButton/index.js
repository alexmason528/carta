import React, { Component, PropTypes } from 'react'
import className from 'classnames'
import './style.scss'

const AddPostButton = ({ show, type, onClick }) => {
  const addPostBtnClass = className({
    addPostBtn: true,
    'addPostBtn--afterImage': type === 'image',
    'addPostBtn--afterText': type === 'text',
  })

  return (
    <button className={addPostBtnClass} onClick={onClick}>
      <div className="btnImage">
        <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/add-post.png" role="presentation" />
      </div>
      <div className="btnText">Post</div>
    </button>
  )
}

AddPostButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string,
  show: PropTypes.bool,
}

export default AddPostButton
