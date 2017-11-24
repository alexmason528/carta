import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import cx from 'classnames'
import axios from 'axios'
import { injectIntl, intlShape, FormattedDate } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { DeleteButton, EditButton, LinkButton, RemoveButton } from 'components/Buttons'
import { CLOUDINARY_ICON_URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from 'containers/App/constants'
import { updatePostRequest, deletePostRequest, postEditStart, postEditEnd, postTitleChange, postContentChange, postImageChange, postLinkChange, postShowLinkBar, postShowDeleteConfirm } from 'containers/HomePage/actions'
import { UPDATE_POST_REQUEST, DELETE_POST_REQUEST } from 'containers/HomePage/constants'
import messages from 'containers/HomePage/messages'
import { getTextFromDate } from 'utils/dateHelper'
import { elemToText, textToElem } from 'utils/stringHelper'
import { getCroppedImage } from 'utils/imageHelper'
import Resizable from 'components/Resizable'
import Img from 'components/Img'
import LinkBar from './LinkBar'
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
    const { _id, title, content, img, link } = this.props
    const data = { _id, title, content, img, link, showDeleteConfirm: false, showLinkBar: false }
    this.props.postEditStart(data)
  }

  handleSubmit = () => {
    const { img } = this.props
    if (img.indexOf('data:image') !== -1) {
      this.setState({ imageUpload: { uploading: true, error: null } })
      let formData = new FormData()
      formData.append('file', img)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }).then(res => {
        const { data: { url } } = res
        this.setState({ imageUpload: { uploading: false, error: null } })
        this.props.postImageChange(url)
        this.props.updatePostRequest()
      }).catch(err => {
        this.setState({ imageUpload: { uploading: false, error: null } })
      })
    } else {
      this.props.updatePostRequest()
    }
  }

  handlePostClick = () => {
    if (this.props.showDeleteConfirm) { this.props.postShowDeleteConfirm(false) }
    if (this.props.showLinkBar) { this.props.postShowLinkBar(false) }
  }

  handleLinkButtonClick = evt => {
    evt.stopPropagation()
    this.props.postShowLinkBar(!this.props.showLinkBar)
  }

  handleDelete = () => {
    this.props.postShowDeleteConfirm(!this.props.showDeleteConfirm)
  }

  handleDeleteConfirm = () => {
    this.props.deletePostRequest(this.props._id)
  }

  handlePostRemoveImage = () => {
    this.props.postImageChange(null)
    this.props.postContentChange(this.props.content || '')
  }

  handlePostTitleChange = value => {
    this.props.postTitleChange(value)
  }

  handlePostRemoveContent = () => {
    this.props.postContentChange('')
  }

  render() {
    const { _id, img, title, content, link, firstname, created_at, locale, info, intl, editing, editable, showLinkBar, showDeleteConfirm } = this.props
    const { postTitleChange, postShowLinkBar, postLinkChange, postEditEnd, postContentChange, postShowDeleteConfirm, postImageChange } = this.props
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

    const linkBarProps = { link, showLinkBar, postShowLinkBar, postLinkChange }

    return (
      <div className="postContainer">
        { (showLinkBar || showInfo || showDeleteConfirm) && <div className="backLayer" onClick={this.handlePostClick} /> }
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        <div className="post mixedPost">
          <a className={cx({ postImage: true, noLink: !link })} href={postLink}>
            { showImage && <Img onLoad={this.handleResize} src={img} /> }
            { editing && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" hover onClick={this.handlePostRemoveImage} /> }
            { showPostLinkButton && <LinkButton onClick={this.handleLinkButtonClick} /> }
            <LinkBar {...linkBarProps} />
            { editing
              ? <Resizable className="postTitleEdit" tabIndex={1} placeholder={formatMessage(messages.title)} onChange={this.handlePostTitleChange} value={title} />
              : <div className="postTitle" onClick={this.handleOpenLink} title={elemToText(title)} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
            }
          </a>
          <div className="postContent">
            { editing && <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostRemoveContent} /> }
            <div className="postMeta">
              { firstname } - CARTA | {getTextFromDate(created_at, locale)}
              { editable && !editing && <EditButton onClick={this.handleEditStart} /> }
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
              <DeleteButton onClick={this.handleDelete} onConfirm={this.handleDeleteConfirm} showConfirm={showDeleteConfirm} />
              <button type="button" className="postBorderBtn" title={submitErrorTxt} disabled={!submittable} onClick={this.handleSubmit}>{formatMessage(messages.submit)}</button>
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
