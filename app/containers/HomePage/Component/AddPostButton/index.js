import React, { Component } from 'react'
import './style.scss'

const AddPostButton = () => {
  return (
    <button className="addPostBtn">
      <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/add-post.png" role="presentation" />
      <div>Post</div>
    </button>
  )
}

export default AddPostButton
