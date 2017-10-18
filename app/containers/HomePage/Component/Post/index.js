import React, { Component, PropTypes } from 'react'
import Image from 'react-image'
import className from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import { Popover, PopoverBody } from 'reactstrap'
import { getTextFromDate } from 'utils/dateHelper'
import './style.scss'

class Post extends Component {
  constructor(props) {
    super(props)

    this.state = {
      img: '',
      content: '',
      title: '',
      username: '',
      editable: false,
      created_at: null,
      first: false,
      showDeleteConfirm: false,
      showInfo: false,
    }
  }

  componentWillMount() {
    this.setState({
      ...this.props,
    })
  }

  handleAddMedia = evt => {
    this.mediaUploader.click()
  }

  handleFiles = (evt) => {
    this.setState({
      img: evt.target.files[0],
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
      img: null,
      title: null,
      content: null,
      showDeleteConfirm: false,
    })
  }

  handleRemovePostImage = () => {
    this.setState({
      img: null,
    })
  }

  handleRemoveContent = () => {
    this.setState({
      content: null,
    })
  }

  toggleInfo = () => {
    this.setState({
      showInfo: !this.state.showInfo,
    })
  }

  render() {
    const { show, onClose } = this.props
    const { img, title, content, created_at, username, editable, showDeleteConfirm, showInfo } = this.state

    let postType

    if (img && content) {
      postType = 'normalPost'
    } else if (img && !content) {
      postType = 'imagePost'
    } else if (!img && content) {
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

    const postInfoClass = className({
      info: true,
      'info--hidden': !showInfo,
    })

    return (
      <div className={addPostFormClass}>
        { postType === 'imagePost' &&
          <div className={`addPostForm__${postType}`}>
            <Image className="postImage" src={img} />
            { editable &&
              <button type="button" className="removeImageButton" onClick={this.handleRemovePostImage}>
                <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close-white-shadow.png" role="presentation" />
              </button>
            }
            { editable &&
              <button type="button" className="linkButton" onClick={this.handleLinkButtonClick}>
                <div className="btnImage">
                  <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/add-post.png" role="presentation" />
                </div>
                <div className="btnText">Link</div>
              </button>
            }
            <div className="postTitle">
              {title}
            </div>
            <div className={postInfoClass}>
              {username} - Carta | {getTextFromDate(created_at)}
            </div>
            <button className="infoBtn" onClick={this.toggleInfo}>
              <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/info.png" role="presentation" />
            </button>
          </div>
        }

        { postType === 'normalPost' &&
          <div className={`addPostForm__${postType}`}>
            <Image className="postImage" src={img} />
            {editable &&
              <button type="button" className="removeImageButton" onClick={this.handleRemovePostImage}>
                <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close-white-shadow.png" role="presentation" />
              </button>
            }
            { editable &&
              <button type="button" className="linkButton" onClick={this.handleLinkButtonClick}>
                <div className="btnImage">
                  <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/add-post.png" role="presentation" />
                </div>
                <div className="btnText">Link</div>
              </button>
            }
            <div className="postTitle">
              <div>
                {title}
              </div>
            </div>
            <div className="postContent">
              {editable && <button type="button" className="removeContentButton" onClick={this.handleRemoveContent}>
                <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close.png" role="presentation" />
              </button>}
              <div className="postContentMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
              </div>
              <div contentEditable={editable || show} className="postContentText" onChange={this.handleContentChange}>
                {content}
              </div>
            </div>
          </div>
        }

        { postType === 'textPost' &&
          <div className={`addPostForm__${postType}`}>
            <div className="postTitle">
              {title}
            </div>
            <div className="postContent">
              {editable &&
                <button type="button" className="removeContentButton" onClick={this.handleRemoveContent}>
                  <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close.png" role="presentation" />
                </button>
              }
              <div className="postContentMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
              </div>
              <div contentEditable={editable || show} className="postContentText" onChange={this.handleContentChange}>
                {content}
              </div>
            </div>
          </div>
        }

        { (editable || show) &&
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
        }
      </div>
    )
  }
}

Post.propTypes = {
  onClose: PropTypes.func,
  show: PropTypes.bool,
}

export default Post
