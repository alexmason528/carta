import React, { Component, PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import className from 'classnames'

const CreatePostButton = ({ type, onClick }) => {
  const btnClass = className({
    createPostBtn: true,
    'createPostBtn--afterImage': type === 'image',
    'createPostBtn--afterText': type === 'text',
  })

  return (
    <button className={btnClass} onClick={onClick}>
      <div className="btnImage">
        <img src={`${CLOUDINARY_ICON_URL}/add-post.png`} role="presentation" />
      </div>
      <div className="btnText">Post</div>
    </button>
  )
}

CreatePostButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string,
}

export default CreatePostButton
