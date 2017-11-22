import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { DeleteButton, EditButton, LinkButton, RemoveButton } from 'components/Buttons'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { updatePostRequest, deletePostRequest, postEditStart, postEditEnd, postTitleChange, postContentChange, postImageChange, postLinkChange, postShowLinkBar, postShowDeleteConfirm } from 'containers/HomePage/actions'
import { UPDATE_POST_REQUEST, DELETE_POST_REQUEST } from 'containers/HomePage/constants'
import messages from 'containers/HomePage/messages'
import { getTextFromDate } from 'utils/dateHelper'
import { elemToText, textToElem } from 'utils/stringHelper'
import { getCroppedImage, uploadImage } from 'utils/imageHelper'
import Resizable from 'components/Resizable'
import './style.scss'

class MixedPost extends Component {
  static propTypes = {
    updatePostRequest: PropTypes.func,
    deletePostRequest: PropTypes.func,
    postImageChange: PropTypes.func,
    postEditStart: PropTypes.func,
    postShowDeleteConfirm: PropTypes.func,
    postShowLinkBar: PropTypes.func,
    postTitleChange: PropTypes.func,
    postLinkChange: PropTypes.func,
    postEditEnd: PropTypes.func,
    postContentChange: PropTypes.func,
    info: PropTypes.object,
    intl: intlShape.isRequired,
    _id: PropTypes.string,
    title: PropTypes.string,
    img: PropTypes.string,
    content: PropTypes.string,
    link: PropTypes.string,
    locale: PropTypes.string,
    firstname: PropTypes.string,
    created_at: PropTypes.string,
    editing: PropTypes.bool,
    editable: PropTypes.bool,
    showLinkBar: PropTypes.bool,
    showDeleteConfirm: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      showInfo: false,
      imageUpload: {
        uploading: false,
        error: false,
      },
    }
  }

  handleEditStart = () => {
    const { _id, title, content, img, link, postEditStart } = this.props
    const data = { _id, title, content, img, link, showDeleteConfirm: false, showLinkBar: false }
    postEditStart(data)
  }

  handleSubmit = () => {
    const { img, updatePostRequest, postImageChange } = this.props
    if (img.indexOf('data:image') !== -1) {
      this.setState({ imageUpload: { uploading: true, error: null } })
      uploadImage(img, this.handlePostImageUploadSuccess, this.handlePostImageUploadFail)
    } else {
      updatePostRequest()
    }
  }

  handlePostImageUploadSuccess(res) {
    const { data: { url } } = res
    this.setState({ imageUpload: { uploading: false, error: null } })
    postImageChange(url)
    updatePostRequest()
  }

  handlePostImageUploadFail(err) {
    this.setState({ imageUpload: { uploading: false, error: null } })
  }

  handlePostClick = () => {
    const { postShowDeleteConfirm, postShowLinkBar, showLinkBar, showDeleteConfirm } = this.props
    if (showDeleteConfirm) { postShowDeleteConfirm(false) }
    if (showLinkBar) { postShowLinkBar(false) }
  }

  render() {
    const { _id, img, title, content, link, firstname, created_at, locale, info, intl, editing, editable, showLinkBar, showDeleteConfirm } = this.props
    const { postTitleChange, postShowLinkBar, postLinkChange, postEditEnd, postContentChange, postShowDeleteConfirm, postImageChange, deletePostRequest } = this.props
    const { error, status } = info
    const { formatMessage } = intl
    const { showInfo, imageUpload } = this.state
    const showPostLinkButton = editing && !showLinkBar
    const showImage = status !== UPDATE_POST_REQUEST
    const spinnerShow = editing && (status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST || imageUpload.uploading)
    const remainCharCnts = !content ? 1000 : 1000 - content.length
    const submittable = title && (img || content) && (remainCharCnts >= 0)

    let postLink
    if (editing) {
      postLink = '#'
    } else if (link) {
      postLink = (link.indexOf('http:') !== -1 || link.indexOf('https:') !== -1) ? link : `http://${link}`
    } else {
      postLink = img
    }

    let submitErrorTxt = ''
    if (!title) {
      submitErrorTxt = formatMessage(messages.requireTitle)
    } else if (!img && !content) {
      submitErrorTxt = formatMessage(messages.requireContent)
    } else if (remainCharCnts < 0) {
      submitErrorTxt = formatMessage(messages.limitExceeded)
    }

    return (
      <div className="postContainer">
        { (showLinkBar || showInfo || showDeleteConfirm) && <div className="backLayer" onClick={this.handlePostClick} /> }
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        <div className="post mixedPost">
          <a className={cx({ postImage: true, noLink: !link })} href={postLink}>
            { showImage && <img onLoad={this.handleResize} src={img} role="presentation" /> }
            { editing && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" hover onClick={() => { postImageChange(null); postContentChange(content || '') }} /> }
            { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={evt => { evt.stopPropagation(); postShowLinkBar(!showLinkBar) }} /> }
            <div className={cx({ postLinkBar: true, 'postLinkBar--hidden': !showLinkBar })} onClick={evt => { evt.stopPropagation() }}>
              <img onClick={evt => { evt.stopPropagation(); postShowLinkBar(!showLinkBar) }} src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
              <input type="text" value={link} placeholder={formatMessage(messages.linkMessage)} onKeyDown={evt => { if (evt.keyCode === 13) { postShowLinkBar(false) } }} onChange={evt => { evt.stopPropagation(); postLinkChange(evt.target.value) }} />
            </div>
            { editing
              ? <Resizable className="postTitleEdit" tabIndex={1} placeholder="Title" onChange={value => { postTitleChange(value) }} value={title} />
              : <div className="postTitle" onClick={this.handleOpenLink} title={elemToText(title)} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
            }
          </a>
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
              <span style={{ marginRight: '8px' }}>{ remainCharCnts >= 0 ? remainCharCnts : 0 }</span>
            </div>
            <div className="right">
              <button type="button" className="postCancelBtn" onClick={postEditEnd}>{formatMessage(messages.cancel)}</button>
              <DeleteButton className="postDeleteBtn" onClick={() => { postShowDeleteConfirm(!showDeleteConfirm) }} onConfirm={() => { deletePostRequest(_id) }} showConfirm={showDeleteConfirm} />
              <button type="button" title={submitErrorTxt} className={cx({ postBorderBtn: true, disabled: !submittable })} disabled={!submittable} onClick={this.handleSubmit}>{formatMessage(messages.submit)}</button>
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
  postImageChange,
  postLinkChange,
  postShowLinkBar,
  postShowDeleteConfirm,
}

export default injectIntl(connect(null, actions)(MixedPost))
