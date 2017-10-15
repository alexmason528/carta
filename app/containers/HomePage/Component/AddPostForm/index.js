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
    }
  }

  addMedia = evt => {
    this.mediaUploader.click()
  }

  handleFiles = (evt) => {
    this.setState({
      file: evt.target.files[0],
    })
  }

  handleCancel = () => {

  }

  addText = () => {
  }

  handleDelete = () => {
  }

  render() {
    const { show, onClose } = this.props
    const { file } = this.state

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
        <button type="button" className={closeButtonClass} onClick={onClose}>
          <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close.png" role="presentation" />
        </button>
        <CSSTransitionGroup
          transitionName="slide"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          { file && <FileImage className="postImage" file={file} /> }
        </CSSTransitionGroup>
        <div className="addPostForm__buttons">
          <div className="left">
            <input type="file" ref={(ref) => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
            {!file && <button type="button" className="addPostForm__borderButton" onClick={this.addMedia}>
              + MEDIA
            </button>}
            <button type="button" className="addPostForm__borderButton" onClick={this.addText}>
              + TEXT
            </button>
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
