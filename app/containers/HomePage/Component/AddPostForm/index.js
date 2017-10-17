import React, { Component, PropTypes } from 'react'
import FileImage from 'react-file-image'
import className from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import './style.scss'

class AddPostForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      file: null,
      postType: null,
    }
  }

  handleAddMedia = evt => {
    this.mediaUploader.click()
  }

  handleFiles = (evt) => {
    this.setState({
      file: evt.target.files[0],
    })
  }

  handleCancel = () => {
  }

  handleAddText = () => {
  }

  handleDelete = () => {
  }

  handleRemovePostImage = () => {
    this.setState({
      file: null,
    })
  }

  render() {
    const { show, onClose } = this.props
    const { file, postType } = this.state

    const addPostFormClass = className({
      addPostForm: true,
      'addPostForm--hidden': !show,
    })

    const hasContent = !!file

    const closeButtonClass = className({
      addPostForm__closeButton: true,
      'addPostForm__closeButton--hasContent': !!file,
    })

    return (
      <div className={addPostFormClass}>
        <CSSTransitionGroup
          transitionName="slide"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          { file &&
            <div>
              <FileImage className="addPostForm__postImage" file={file} />
              <button type="button" className="addPostForm__removeImageButton" onClick={this.handleRemovePostImage}>
                <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close-white-shadow.png" role="presentation" />
              </button>
              <button type="button" className="addPostForm__linkButton" onClick={this.handleLinkButtonClick}>
                <div className="btnImage">
                  <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/add-post.png" role="presentation" />
                </div>
                <div className="btnText">Link</div>
              </button>
            </div>
          }
        </CSSTransitionGroup>

        <div className="addPostForm__postTitle">
          <input type="text" placeholder="Title" />
        </div>
        <div className="addPostForm__postText">
          asdfasdf
        </div>

        <div className="addPostForm__buttons">
          <div className="left">
            <input type="file" ref={(ref) => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
            {(postType === 'normal' || postType === 'image') && <button type="button" className="addPostForm__borderButton" onClick={this.handleAddMedia}>
              + MEDIA
            </button>}
            {<button type="button" className="addPostForm__borderButton" onClick={this.handleAddText}>
              + TEXT
            </button>}
          </div>
          { file &&
            <div className="right">
              <button type="button" className="addPostForm__button" onClick={this.handleCancel}>
                CANCEL
              </button>
              <button type="button" className="addPostForm__deleteButton" onClick={this.handleDelete}>
                <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/trash.png" role="presentation" />
              </button>
              <button type="button" className="addPostForm__borderButton" onClick={this.handleSubmit}>
                SUBMIT
              </button>
            </div>
          }
          <button type="button" className={closeButtonClass} onClick={onClose}>
            <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close.png" role="presentation" />
          </button>
        </div>
      </div>
    )
  }
}

AddPostForm.propTypes = {
  onClose: PropTypes.func,
  show: PropTypes.bool,
}

export default AddPostForm
