import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { UPDATE_POST_REQUEST, DELETE_POST_REQUEST } from 'containers/HomePage/constants'
import messages from 'containers/HomePage/messages'
import { DeleteButton, EditButton, RemoveButton } from 'components/Buttons'
import LoadingSpinner from 'components/LoadingSpinner'
import Resizable from 'components/Resizable'
import { QuarterSpinner } from 'components/SvgIcon'
import { getTextFromDate } from 'utils/dateHelper'
import { getCroppedImage } from 'utils/imageHelper'
import { getSubmitError } from 'utils/stringHelper'
import './style.scss'

class TextPost extends Component {
  static propTypes = {
    updatePostRequest: PropTypes.func,
    deletePostRequest: PropTypes.func,
    postEditStart: PropTypes.func,
    postShowDeleteConfirm: PropTypes.func,
    postTitleChange: PropTypes.func,
    postImageChange: PropTypes.func,
    postEditEnd: PropTypes.func,
    postContentChange: PropTypes.func,
    info: PropTypes.object,
    intl: intlShape.isRequired,
    _id: PropTypes.string,
    title: PropTypes.object,
    img: PropTypes.string,
    content: PropTypes.object,
    link: PropTypes.string,
    firstname: PropTypes.string,
    created_at: PropTypes.string,
    editing: PropTypes.bool,
    editable: PropTypes.bool,
    showDeleteConfirm: PropTypes.bool,
  }

  handleEditStart = () => {
    const { _id, title, img, link, content } = this.props
    const data = { _id, title, img, link, content, showDeleteConfirm: false, showLinkBar: false }
    this.props.postEditStart(data)
  }

  handlePostClick = () => {
    if (this.props.showDeleteConfirm) { this.props.postShowDeleteConfirm(false) }
  }

  handleDelete = () => {
    this.props.postShowDeleteConfirm(!this.props.showDeleteConfirm)
  }

  handleDeleteConfirm = () => {
    this.props.deletePostRequest(this.props._id)
  }

  handlePostContentChange = value => {
    this.props.postContentChange(value)
  }

  handlePostTitleChange = value => {
    this.props.postTitleChange(value)
  }

  handlePostRemoveContent = () => {
    this.props.postContentChange('')
  }

  handleAddMedia = () => {
    this.mediaUploader.click()
  }

  handleFiles = evt => {
    getCroppedImage(evt.target.files[0], this.handleImage, 'landscape')
  }

  handleImage = (img, type) => {
    this.props.postImageChange(img)
  }

  render() {
    const {
      _id,
      title,
      img,
      content,
      firstname,
      created_at,
      editing,
      editable,
      showDeleteConfirm,
      info: { status, error },
      intl: { formatMessage, locale },
      postEditEnd,
      updatePostRequest,
    } = this.props

    const spinnerShow = editing && (status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST)
    const remainCharCnts = !content ? 1000 : 1000 - content.length
    const submittable = title && content && (remainCharCnts >= 0)

    let submitError = getSubmitError(img, title, content, formatMessage)

    return (
      <div className="postContainer">
        { showDeleteConfirm && <div className="backLayer" onClick={this.handlePostClick} /> }
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>

        <div className="post textPost" onClick={this.handlePostClick}>
          { editing
            ? <Resizable className="postTitleEdit" tabIndex={1} placeholder={formatMessage(messages.title)} onChange={this.handlePostTitleChange} value={title} />
            : <div className="postTitle" title={title} dangerouslySetInnerHTML={{ __html: title[locale] }} />
          }
          <div className="postContent">
            { editing && <RemoveButton type="content" onClick={this.handlePostRemoveContent} /> }
            <div className="postMeta">
              { firstname } - CARTA | {getTextFromDate(created_at, locale)}
              { editable && !editing && <EditButton onClick={this.handleEditStart} /> }
            </div>
            { editing
              ? <Resizable className="postText" tabIndex={2} placeholder={formatMessage(messages.writeHere)} onChange={this.handlePostContentChange} value={content} />
              : <div className="postText" dangerouslySetInnerHTML={{ __html: content[locale] }} />
            }
          </div>
        </div>

        { editing &&
          <div className="postButtons">
            <div className="left">
              <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
              <span style={{ marginRight: '8px' }}>{ remainCharCnts >= 0 ? remainCharCnts : 0 }</span>
              <button type="button" className="postBorderBtn" onClick={this.handleAddMedia}>+ {formatMessage(messages.picture)}</button>
            </div>
            <div className="right">
              <button type="button" className="postCancelBtn" onClick={postEditEnd}>{formatMessage(messages.cancel)}</button>
              <DeleteButton onClick={this.handleDelete} onConfirm={this.handleDeleteConfirm} showConfirm={showDeleteConfirm} />
              <button type="button" className="postBorderBtn" title={submitError} disabled={!submittable} onClick={updatePostRequest}>{formatMessage(messages.submit)}</button>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default injectIntl(TextPost)
