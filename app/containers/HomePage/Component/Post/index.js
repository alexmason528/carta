import React, { Component, PropTypes } from 'react'
import FileImage from 'react-file-image'
import className from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import { Popover, PopoverBody } from 'reactstrap'
import { getTextFromDate } from 'utils/dateHelper'
import { DeleteButton, EditButton, InfoButton, LinkButton, RemoveButton } from 'components/Buttons'
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
      editing: false,
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
    this.setState({
      editing: false,
    })
  }

  handleAddText = () => {
    this.setState({
      content: true,
    })
  }

  handleContentChange = (evt) => {
    this.setState({
      content: evt.target.value,
    })
  }

  handleDelete = () => {
    this.setState({
      showDeleteConfirm: !this.state.showDeleteConfirm,
    })
  }

  handleLinkButtonClick = () => {

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

  handleStartEdit = () => {
    this.setState({
      editing: true,
    })
  }

  toggleInfo = () => {
    this.setState({
      showInfo: !this.state.showInfo,
    })
  }

  render() {
    const { show, onClose } = this.props
    const { img, title, content, created_at, username, editable, showDeleteConfirm, showInfo, editing, first, adding } = this.state

    let postType

    if (img && content) {
      postType = 'normalPost'
    } else if (img && !content) {
      postType = 'imagePost'
    } else if (!img && content) {
      postType = 'textPost'
    }

    const postFormClass = className({
      postForm: true,
      first: first,
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
      <div className={postFormClass}>
        { postType === 'imagePost' &&
          <div className={`postForm__${postType}`}>
            { editable && !editing && <EditButton className="postEditBtn" image="edit-white" onClick={this.handleStartEdit} /> }
            { img && typeof (img) === 'string' && <img className="postImage" src={img} role="presentation" />}
            { img && typeof (img) === 'object' && <FileImage className="postImage" file={img} />}
            { editable && editing && <RemoveButton className="removeImageButton" image="close-white-shadow" onClick={this.handleRemovePostImage} /> }
            { editable && editing && <LinkButton className="linkButton" onClick={this.handleLinkButtonClick} />}
            <div className="postTitle">
              {title}
            </div>
            <div className={postInfoClass}>
              {username} - Carta | {getTextFromDate(created_at)}
            </div>
            <InfoButton className="infoBtn" onClick={this.toggleInfo} />
          </div>
        }

        { postType === 'normalPost' &&
          <div className={`postForm__${postType}`}>
            <div className="postImage">
              { img && typeof (img) === 'string' && <img className="postImage" src={img} role="presentation" />}
              { img && typeof (img) === 'object' && <FileImage className="postImage" file={img} />}
              { editable && editing && <RemoveButton className="removeImageButton" image="close-white-shadow" onClick={this.handleRemovePostImage} /> }
              { editable && editing && <LinkButton className="linkButton" onClick={this.handleLinkButtonClick} /> }
              <div className="postTitle">
                <div>
                  {title}
                </div>
              </div>
            </div>
            <div className="postContent">
              { editable && editing && <RemoveButton className="removeContentButton" image="close" onClick={this.handleRemoveContent} /> }
              <div className="postContentMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              <div className="postContentText" onChange={this.handleContentChange} value={content}>
                {content}
              </div>
            </div>
          </div>
        }

        { postType === 'textPost' &&
          <div className={`postForm__${postType}`}>
            <div className="postTitle">
              {title}
            </div>
            <div className="postContent">
              { editable && editing && <RemoveButton className="removeContentButton" image="close" onClick={this.handleRemoveContent} /> }
              <div className="postContentMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              <div className="postContentText" onChange={this.handleContentChange}>
                {content}
              </div>
            </div>
          </div>
        }

        { editable && editing &&
          <div className="postForm__buttons">
            <div className="left">
              <input type="file" ref={(ref) => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
              {(postType === 'textPost' || postType === 'normalPost') &&
                <span style={{ marginRight: '8px' }}>{ content === true ? 1000 : (1000 - content.length) }</span>
              }
              {(postType !== 'imagePost' && postType !== 'normalPost') && <button type="button" className="postForm__borderButton" onClick={this.handleAddMedia}>
                + MEDIA
              </button>}
              {(postType !== 'textPost' && postType !== 'normalPost') && <button type="button" className="postForm__borderButton" onClick={this.handleAddText}>
                + TEXT
              </button>}
            </div>
            { postType &&
              <div className="right">
                <button type="button" className="postForm__button" onClick={this.handleCancel}>
                  CANCEL
                </button>
                <DeleteButton className="postForm__deleteButton" onClick={this.handleDelete} onConfirm={this.handleDeleteConfirm} showConfirm={showDeleteConfirm} />
                <button type="button" className="postForm__borderButton" onClick={this.handleSubmit}>
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
