import React, { Component, PropTypes } from 'react'
import FileImage from 'react-file-image'
import className from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import { Popover, PopoverBody } from 'reactstrap'
import './style.scss'

class AddPostForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      image: null,
      title: null,
      content: null,
      showDeleteConfirm: false,
    }
  }

  handleAddMedia = evt => {
    this.mediaUploader.click()
  }

  handleFiles = (evt) => {
    this.setState({
      image: evt.target.files[0],
    })
  }

  handleCancel = () => {
  }

  handleAddText = () => {
    this.setState({
      content: true,
    })
  }

  handleContentChange = (evt) => {
    this.setState({
      content: evt.target.value ? evt.target.value : true,
    })
  }

  handleDelete = () => {
    this.setState({
      showDeleteConfirm: !this.state.showDeleteConfirm,
    })
  }

  handleDeleteConfirm = () => {
    this.setState({
      image: null,
      title: null,
      content: null,
      showDeleteConfirm: false,
    })
  }

  handleRemovePostImage = () => {
    this.setState({
      image: null,
    })
  }

  handleRemoveContent = () => {
    this.setState({
      content: null,
    })
  }

  render() {
    const { show, onClose } = this.props
    const { image, title, content, showDeleteConfirm } = this.state

    let postType

    if (image && content) {
      postType = 'normalPost'
    } else if (image && !content) {
      postType = 'imagePost'
    } else if (!image && content) {
      postType = 'textPost'
    }

    const addPostFormClass = className({
      addPostForm: true,
      'addPostForm--hidden': !show,
    })

    const closeButtonClass = className({
      closeButton: true,
      'closeButton--hasContent': postType,
    })

    return (
      <div className={addPostFormClass}>
        { postType === 'imagePost' &&
          <div className={`addPostForm__${postType}`}>
            <FileImage className="postImage" file={image} />
            <button type="button" className="removeImageButton" onClick={this.handleRemovePostImage}>
              <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close-white-shadow.png" role="presentation" />
            </button>
            <button type="button" className="linkButton" onClick={this.handleLinkButtonClick}>
              <div className="btnImage">
                <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/add-post.png" role="presentation" />
              </div>
              <div className="btnText">Link</div>
            </button>
            <div className="postTitle">
              <input type="text" placeholder="Title" />
            </div>
          </div>
        }

        { postType === 'normalPost' &&
          <div className={`addPostForm__${postType}`}>
            <FileImage className="postImage" file={image} />
            <button type="button" className="removeImageButton" onClick={this.handleRemovePostImage}>
              <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close-white-shadow.png" role="presentation" />
            </button>
            <button type="button" className="linkButton" onClick={this.handleLinkButtonClick}>
              <div className="btnImage">
                <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/add-post.png" role="presentation" />
              </div>
              <div className="btnText">Link</div>
            </button>
            <div className="postTitle">
              <input type="text" placeholder="Title" />
            </div>
            <div className="postContent">
              <button type="button" className="removeContentButton" onClick={this.handleRemoveContent}>
                <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close.png" role="presentation" />
              </button>
              <div className="postContentMeta">
                MARTIJN SNELDER - CARTA | NOW
              </div>
              <textarea className="postContentText" onChange={this.handleContentChange} placeholder="Type here...">
              </textarea>
            </div>
          </div>
        }

        { postType === 'textPost' &&
          <div className={`addPostForm__${postType}`}>
            <div className="postTitle">
              <input type="text" placeholder="Title" />
            </div>
            <div className="postContent">
              <button type="button" className="removeContentButton" onClick={this.handleRemoveContent}>
                <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close.png" role="presentation" />
              </button>
              <div className="postContentMeta">
                MARTIJN SNELDER - CARTA | NOW
              </div>
              <textarea className="postContentText" onChange={this.handleContentChange} placeholder="Type here...">
              </textarea>
            </div>
          </div>
        }

        <div className="addPostForm__buttons">
          <div className="left">
            <input type="file" ref={(ref) => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
            {(postType === 'textPost' || postType === 'normalPost') &&
              <span style={{ marginRight: '8px' }}>{ content === true ? 1000 : (1000 - content.length) }</span>
            }
            {(postType !== 'imagePost' && postType !== 'normalPost') && <button type="button" className="addPostForm__borderButton" onClick={this.handleAddMedia}>
              + MEDIA
            </button>}
            {(postType !== 'textPost' && postType !== 'normalPost') && <button type="button" className="addPostForm__borderButton" onClick={this.handleAddText}>
              + TEXT
            </button>}
          </div>
          { postType &&
            <div className="right">
              <button type="button" className="addPostForm__button" onClick={this.handleCancel}>
                CANCEL
              </button>
              <div className="addPostForm__deleteButton" onClick={this.handleDelete}>
                <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/trash.png" role="presentation" />
                <div className="popOver" style={{ display: showDeleteConfirm ? 'block' : 'none' }}>
                  <button type="button" onClick={this.handleDeleteConfirm}>SURE?</button>
                </div>
              </div>
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
