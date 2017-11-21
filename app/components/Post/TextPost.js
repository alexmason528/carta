import React, { Component, PropTypes } from 'react'
import ReactDOM, { createPortal } from 'react-dom'
import cx from 'classnames'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { updatePostRequest, deletePostRequest, postEditStart, postEditEnd, postTitleChange, postImageChange, postContentChange, postShowDeleteConfirm } from 'containers/HomePage/actions'
import { UPDATE_POST_REQUEST, DELETE_POST_REQUEST } from 'containers/HomePage/constants'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { DeleteButton, EditButton, RemoveButton } from 'components/Buttons'
import messages from 'containers/HomePage/messages'
import { getTextFromDate } from 'utils/dateHelper'
import { elemToText, textToElem } from 'utils/stringHelper'
import { getCroppedImage } from 'utils/imageHelper'
import Resizable from 'components/Resizable'
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
    title: PropTypes.string,
    img: PropTypes.string,
    content: PropTypes.string,
    link: PropTypes.string,
    firstname: PropTypes.string,
    created_at: PropTypes.string,
    locale: PropTypes.string,
    editing: PropTypes.bool,
    editable: PropTypes.bool,
    showDeleteConfirm: PropTypes.bool,
  }

  handleImage = (img, type) => {
    const { postImageChange } = this.props
    postImageChange(img)
  }

  handleEditStart = () => {
    const { _id, title, img, link, content, postEditStart } = this.props
    const data = { _id, title, img, link, content, showDeleteConfirm: false, showLinkBar: false }
    postEditStart(data)
  }

  handlePostClick = () => {
    const { postShowDeleteConfirm, showDeleteConfirm } = this.props
    if (showDeleteConfirm) { postShowDeleteConfirm(false) }
  }

  render() {
    const { _id, title, content, firstname, created_at, locale, editing, showDeleteConfirm, info, intl, editable } = this.props
    const { postTitleChange, postEditEnd, postContentChange, postShowDeleteConfirm, deletePostRequest, updatePostRequest } = this.props
    const { status, error } = info
    const { formatMessage } = intl

    const spinnerShow = editing && (status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST)
    const remainCharCnts = !content ? 1000 : 1000 - content.length
    const submittable = title && content && (remainCharCnts >= 0)

    let submitErrorTxt = ''

    if (!title) {
      submitErrorTxt = formatMessage(messages.requireTitle)
    } else if (!content) {
      submitErrorTxt = formatMessage(messages.requireContent)
    } else if (remainCharCnts < 0) {
      submitErrorTxt = formatMessage(messages.limitExceeded)
    }

    return (
      <div className="postContainer">
        { showDeleteConfirm && <div className="backLayer" onClick={this.handlePostClick} /> }
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>

        <div className="post textPost" onClick={this.handlePostClick}>
          { editing
            ? <Resizable className="postTitleEdit" tabIndex={1} placeholder="Title" onChange={value => { postTitleChange(value) }} value={title} />
            : <div className="postTitle" title={elemToText(title)} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
          }
          <div className="postContent">
            { editing && <RemoveButton className="postRemoveContentBtn" image="close" onClick={() => { postContentChange('') }} /> }
            <div className="postMeta">
              { firstname } - CARTA | {getTextFromDate(created_at, locale)}
              { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleEditStart} /> }
            </div>
            { editing
              ? <Resizable className="postText" tabIndex={2} placeholder={formatMessage(messages.writeHere)} onChange={value => { postContentChange(value) }} value={content} />
              : <div className="postText" dangerouslySetInnerHTML={{ __html: textToElem(content) }} />
            }
          </div>
        </div>

        { editing &&
          <div className="postButtons">
            <div className="left">
              <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={evt => { getCroppedImage(evt.target.files[0], this.handleImage, 'landscape') }} />
              <span style={{ marginRight: '8px' }}>{ remainCharCnts >= 0 ? remainCharCnts : 0 }</span>
              <button type="button" className="postBorderBtn" onClick={() => { this.mediaUploader.click() }}>+ {formatMessage(messages.picture)}</button>
            </div>
            <div className="right">
              <button type="button" className="postCancelBtn" onClick={postEditEnd}>{formatMessage(messages.cancel)}</button>
              <DeleteButton className="postDeleteBtn" onClick={() => { postShowDeleteConfirm(!showDeleteConfirm) }} onConfirm={() => { deletePostRequest(_id) }} showConfirm={showDeleteConfirm} />
              <button type="button" title={submitErrorTxt} className={cx({ postBorderBtn: true, disabled: !submittable })} disabled={!submittable} onClick={updatePostRequest}>{formatMessage(messages.submit)}</button>
            </div>
          </div>
        }
      </div>
    )
  }
}

const actions = {
  updatePostRequest,
  deletePostRequest,
  postEditStart,
  postEditEnd,
  postTitleChange,
  postContentChange,
  postShowDeleteConfirm,
  postImageChange,
}

export default injectIntl(connect(null, actions)(TextPost))
