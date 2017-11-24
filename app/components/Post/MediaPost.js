import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import { connect } from 'react-redux'
import { injectIntl, intlShape, FormattedDate } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { DeleteButton, EditButton, InfoButton, LinkButton, RemoveButton } from 'components/Buttons'
import { updatePostRequest, deletePostRequest, postEditStart, postEditEnd, postTitleChange, postContentChange, postImageChange, postLinkChange, postShowLinkBar, postShowDeleteConfirm } from 'containers/HomePage/actions'
import { UPDATE_POST_REQUEST, DELETE_POST_REQUEST } from 'containers/HomePage/constants'
import messages from 'containers/HomePage/messages'
import { getTextFromDate } from 'utils/dateHelper'
import { elemToText, textToElem, getPostLink, getSubmitError } from 'utils/stringHelper'
import { getCroppedImage } from 'utils/imageHelper'
import Resizable from 'components/Resizable'
import Img from 'components/Img'
import LinkBar from './LinkBar'
import './style.scss'

class MediaPost extends Component {
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
    firstname: PropTypes.string,
    created_at: PropTypes.string,
    editing: PropTypes.bool,
    editable: PropTypes.bool,
    showDeleteConfirm: PropTypes.bool,
    showLinkBar: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = { showInfo: false }
  }

  handleEditStart = evt => {
    evt.stopPropagation()
    const { _id, title, content, img, link } = this.props
    const data = { _id, title, content, img, link, showDeleteConfirm: false, showLinkBar: false }
    this.props.postEditStart(data)
  }

  handlePostInfoToggle = evt => {
    evt.stopPropagation()
    this.setState({ showInfo: !this.state.showInfo })
  }

  handleBackLayerClick = () => {
    if (this.props.showDeleteConfirm) {
      this.props.postShowDeleteConfirm(false)
    }
    if (this.props.showLinkBar) {
      this.props.postShowLinkBar(false)
    }
    this.setState({ showInfo: false })
  }

  handleLinkButtonClick = evt => {
    this.props.postShowLinkBar(!this.props.showLinkBar)
  }

  handleAddText = () => {
    this.props.postContentChange('')
  }

  handlePostRemoveImage = () => {
    this.props.postImageChange(null)
    this.props.postContentChange(this.props.content || '')
  }

  handleDelete = () => {
    this.props.postShowDeleteConfirm(!this.props.showDeleteConfirm)
  }

  handleDeleteConfirm = () => {
    this.props.deletePostRequest(this.props._id)
  }

  handleTitleChange = value => {
    this.props.postTitleChange(value)
  }

  handlePostImageClick = evt => {
    const { editing, link, img } = this.props
    let postLink = getPostLink(editing, link, img)
    if (postLink === '#') { evt.preventDefault() }
  }

  render() {
    const { img, title, content, link, firstname, created_at, editing, editable, showLinkBar, showDeleteConfirm, info: { error, status }, intl: { formatMessage, locale } } = this.props
    const { postShowLinkBar, postLinkChange, postEditEnd, deletePostRequest, updatePostRequest } = this.props

    const { showInfo } = this.state

    const showPostLinkButton = editing && !showLinkBar
    const showImage = status !== UPDATE_POST_REQUEST
    const spinnerShow = editing && (status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST)
    const remainCharCnts = !content ? 1000 : 1000 - content.length
    const submittable = title && (img || content) && (remainCharCnts >= 0)

    let postLink = getPostLink(editing, link, img)
    let submitError = getSubmitError(img, title, content, formatMessage)

    const linkBarProps = { link, showLinkBar, postShowLinkBar, postLinkChange }

    return (
      <div className="postContainer">
        { (showLinkBar || showInfo || showDeleteConfirm) && <div className="backLayer" onClick={this.handleBackLayerClick} /> }
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        <div className="post mediaPost">
          <a className={cx({ postImage: true, noLink: !link })} href={postLink} onClick={this.handlePostImageClick}>
            { showImage && <Img onLoad={this.handleResize} src={img} /> }
            { editing
              ? <Resizable className="postTitleEdit" placeholder={formatMessage(messages.title)} onChange={this.handleTitleChange} value={title} />
              : <div className="postTitle" title={elemToText(title)} onClick={this.handleOpenLink} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
            }
          </a>
          <div className={cx({ postInfo: true, 'postInfo--hidden': !showInfo })}>
            { firstname } - Carta | {getTextFromDate(created_at, locale)}
          </div>
          <LinkBar {...linkBarProps} />
          { editable && !editing && <EditButton white onClick={this.handleEditStart} /> }
          { editing && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" hover onClick={this.handlePostRemoveImage} /> }
          { showPostLinkButton && <LinkButton onClick={this.handleLinkButtonClick} /> }
          <InfoButton active={showInfo} onClick={this.handlePostInfoToggle} />
        </div>

        { editing &&
          <div className="postButtons">
            <div className="left">
              <button type="button" className="postBorderBtn" onClick={this.handleAddText}>+ {formatMessage(messages.text)}</button>
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

export default injectIntl(connect(null, actions)(MediaPost))
