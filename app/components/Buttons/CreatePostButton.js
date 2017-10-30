import React, { Component, PropTypes } from 'react'
import className from 'classnames'

const CreatePostButton = ({ show, type, onClick }) => {
  const btnClass = className({
    createPostBtn: true,
    'createPostBtn--afterImage': type === 'image',
    'createPostBtn--afterText': type === 'text',
  })

  return (
    <button className={btnClass} onClick={onClick}>
      <div className="btnImage">
        <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/add-post.png" role="presentation" />
      </div>
      <div className="btnText">Post</div>
    </button>
  )
}

CreatePostButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string,
  show: PropTypes.bool,
}

export default CreatePostButton
