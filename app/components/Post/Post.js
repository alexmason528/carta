import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import axios from 'axios'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { Popover, PopoverBody } from 'reactstrap'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { DeleteButton, EditButton, InfoButton, LinkButton, RemoveButton } from 'components/Buttons'
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_ICON_URL } from 'containers/App/constants'
import {
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
} from 'containers/HomePage/actions'
import { UPDATE_POST_REQUEST, DELETE_POST_REQUEST } from 'containers/HomePage/constants'
import { selectHomeInfo, selectEditingPost } from 'containers/HomePage/selectors'
import { selectLocale } from 'containers/LanguageProvider/selectors'
import messages from 'containers/HomePage/messages'
import { getTextFromDate } from 'utils/dateHelper'
import { elemToText, textToElem } from 'utils/stringHelper'
import { getCroppedImage } from 'utils/imageHelper'
import Resizable from 'components/Resizable'
import './style.scss'

class Post extends Component {
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
    editingPost: PropTypes.object,
    content: PropTypes.string,
    img: PropTypes.string,
    locale: PropTypes.string,
    _id: PropTypes.string,
    title: PropTypes.string,
    link: PropTypes.string,
    username: PropTypes.string,
    created_at: PropTypes.string,
    editable: PropTypes.bool,
    intl: intlShape.isRequired,
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

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const comp = ReactDOM.findDOMNode(this)
    const post = $(comp).find('.post')
    const width = $(post).width()
    if ($(post).hasClass('textPost')) {
      const fontSize = (width / 76) * 3 * 1.15
      $(post).find('.postTitleEdit').css({ fontSize: `${fontSize}px` })
      $(post).find('.postTitle').css({
        fontSize: `${fontSize}px`,
        'max-height': `${fontSize * 2 * 1.2}px`,
        '-webkit-line-clamp': '2',
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
      })
    } else {
      const height = $(post).find('.postImage').height() - ($(post).hasClass('mediaPost') ? 90 : 65)
      const fontSize = (width / 44) * 3 * 1.15
      const lines = fontSize > 0 ? Math.floor(height / (fontSize * 1.2)) : 0
      $(post).find('.postTitle').css({
        fontSize: `${fontSize}px`,
        'max-height': `${fontSize * lines * 1.2}px`,
        '-webkit-line-clamp': lines.toString(),
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
      })
      $(post).find('.postTitleEdit').css({
        fontSize: `${fontSize}px`,
        'max-height': `${fontSize * lines * 1.2}px`,
      })
    }
  }

  handleFiles = evt => {
    const file = evt.target.files[0]
    getCroppedImage(file, this.handleImage, 'landscape')
  }

  handleImage = (img, type) => {
    const { postImageChange } = this.props
    postImageChange(img)
  }

  handleEditStart = () => {
    const { _id, title, content, img, link, postEditStart } = this.props
    const data = {
      _id,
      title,
      content,
      img,
      link,
      showDeleteConfirm: false,
      showLinkBar: false,
    }
    postEditStart(data)
    this.handleResize()
  }

  handleSubmit = () => {
    const { editingPost, updatePostRequest, postImageChange } = this.props

    if (editingPost && editingPost.img && editingPost.img.indexOf('data:image') !== -1) {
      this.setState({ imageUpload: { uploading: true, error: null } })

      let formData = new FormData()
      formData.append('file', editingPost.img)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }).then(res => {
        const { data: { url } } = res
        this.setState({ imageUpload: { uploading: false, error: null } })
        postImageChange(url)
        updatePostRequest()
      }).catch(err => {
        this.setState({ imageUpload: { uploading: false, error: null } })
      })
    } else {
      updatePostRequest()
    }
  }

  handlePostInfoToggle = evt => {
    evt.stopPropagation()
    this.setState({ showInfo: !this.state.showInfo })
  }

  handlePostClick = () => {
    const { postShowDeleteConfirm, postShowLinkBar } = this.props
    postShowDeleteConfirm(false)
    postShowLinkBar(false)
    this.setState({ showInfo: false })
  }

  render() {
    const {
      username,
      created_at,
      editable,
      editingPost,
      locale,
      info: { error, status },
      intl: { formatMessage },
      postTitleChange,
      postShowLinkBar,
      postLinkChange,
      postEditEnd,
      postContentChange,
      postShowDeleteConfirm,
      postImageChange,
      deletePostRequest,
    } = this.props

    const { showInfo, imageUpload } = this.state

    const editing = editingPost && (editingPost._id === this.props._id)
    const _id = editing ? editingPost._id : this.props._id
    const img = editing ? editingPost.img : this.props.img
    const title = editing ? editingPost.title : this.props.title
    const content = editing ? editingPost.content : this.props.content
    const link = editing ? editingPost.link : this.props.link
    const showLinkBar = editing && editingPost.showLinkBar
    const showDeleteConfirm = editing && editingPost.showDeleteConfirm

    const showPostLinkButton = editing && !showLinkBar
    const showImage = status !== UPDATE_POST_REQUEST
    const spinnerShow = editing && (status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST || imageUpload.uploading)
    const remainCharCnts = !content ? 1000 : 1000 - content.length
    const submittable = title && (img || content) && (remainCharCnts >= 0)

    let postType

    if (img && content !== null) {
      postType = 'mixedPost'
    } else if (img && content === null) {
      postType = 'mediaPost'
    } else if (!img && content !== null) {
      postType = 'textPost'
    } else if (title !== null) {
      postType = 'textPost'
    }

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
        { postType === 'mixedPost' &&
          <div className={cx({ post: true, [postType]: true })}>
            <a className={cx({ postImage: true, noLink: !link })} href={postLink}>
              { showImage &&
                <div>
                  <img className="postImage__hoverImg" onLoad={this.handleResize} src={img} role="presentation" />
                  <img src={img} role="presentation" />
                </div>
              }
              { editing &&
                <RemoveButton
                  className="postRemoveImageBtn"
                  image="close-white-shadow"
                  hover
                  onClick={() => {
                    postImageChange(null)
                    postContentChange(content || '')
                  }}
                />
              }
              { showPostLinkButton &&
                <LinkButton
                  className="postLinkBtn"
                  onClick={evt => {
                    evt.stopPropagation()
                    postShowLinkBar(!editingPost.showLinkBar)
                  }}
                />
              }
              <div className={cx({ postLinkBar: true, 'postLinkBar--hidden': !showLinkBar })} onClick={evt => { evt.stopPropagation() }}>
                <img
                  onClick={evt => {
                    evt.stopPropagation()
                    postShowLinkBar(!editingPost.showLinkBar)
                  }}
                  src={`${CLOUDINARY_ICON_URL}/link.png`}
                  role="presentation"
                />
                <input
                  type="text"
                  value={link}
                  placeholder={formatMessage(messages.linkMessage)}
                  onKeyDown={evt => {
                    if (evt.keyCode === 13) { postShowLinkBar(false) }
                  }}
                  onChange={evt => {
                    evt.stopPropagation()
                    postLinkChange(evt.target.value)
                  }}
                />

              </div>
              { editing
                ? <Resizable className="postTitleEdit" tabIndex={1} placeholder="Title" onChange={value => { postTitleChange(value) }} value={editingPost.title} />
                : <div className="postTitle" onClick={this.handleOpenLink} title={elemToText(title)} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
              }
            </a>
            <div className="postContent">
              { editing && <RemoveButton className="postRemoveContentBtn" image="close" onClick={() => { postContentChange('') }} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at, locale)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleEditStart} /> }
              </div>
              { editing
                ? <Resizable className="postText" tabIndex={2} placeholder={formatMessage(messages.writeHere)} onChange={value => { postContentChange(value) }} value={editingPost.content} />
                : <div className="postText" dangerouslySetInnerHTML={{ __html: textToElem(content) }} />
              }
            </div>
          </div>
        }

        { postType === 'mediaPost' &&
          <div className={cx({ post: true, [postType]: true })} onClick={this.handlePostClick}>
            <a className={cx({ postImage: true, noLink: !link })} href={postLink}>
              { editable && !editing && <EditButton className="postEditBtn" image="edit-white-shadow" hover onClick={this.handleEditStart} /> }
              { showImage &&
                <div>
                  <img className="postImage__hoverImg" onLoad={this.handleResize} src={img} role="presentation" />
                  <img src={img} role="presentation" />
                </div>
              }
              { editing &&
                <RemoveButton
                  className="postRemoveImageBtn"
                  image="close-white-shadow"
                  hover
                  onClick={() => {
                    postImageChange(null)
                    postContentChange(content || '')
                  }}
                />
              }
              { showPostLinkButton &&
                <LinkButton
                  className="postLinkBtn"
                  onClick={evt => {
                    evt.stopPropagation()
                    postShowLinkBar(!editingPost.showLinkBar)
                  }}
                />
              }
              <div className={cx({ postLinkBar: true, 'postLinkBar--hidden': !showLinkBar })} onClick={evt => { evt.stopPropagation() }}>
                <img
                  onClick={evt => {
                    evt.stopPropagation()
                    postShowLinkBar(!editingPost.showLinkBar)
                  }}
                  src={`${CLOUDINARY_ICON_URL}/link.png`}
                  role="presentation"
                />
                <input
                  type="text"
                  value={link}
                  placeholder={formatMessage(messages.linkMessage)}
                  onKeyDown={evt => { if (evt.keyCode === 13) { postShowLinkBar(false) } }}
                  onChange={evt => {
                    evt.stopPropagation()
                    postLinkChange(evt.target.value)
                  }}
                />
              </div>
            </a>
            { editing
              ? <Resizable className="postTitleEdit" placeholder="Title" onChange={value => { postTitleChange(value) }} value={editingPost.title} />
              : <div className="postTitle" title={elemToText(title)} onClick={this.handleOpenLink} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
            }
            <div className={cx({ postInfo: true, 'postInfo--hidden': !showInfo })}>
              {username} - Carta | {getTextFromDate(created_at, locale)}
            </div>
            <InfoButton className={cx({ postInfoBtn: true, active: showInfo })} onClick={this.handlePostInfoToggle} />
          </div>
        }

        { postType === 'textPost' &&
          <div className={cx({ post: true, [postType]: true })} onClick={this.handlePostClick}>
            { editing
              ? <Resizable className="postTitleEdit" tabIndex={1} placeholder="Title" onChange={value => { postTitleChange(value) }} value={editingPost.title} />
              : <div className="postTitle" title={elemToText(title)} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
            }
            <div className="postContent">
              { editing && <RemoveButton className="postRemoveContentBtn" image="close" onClick={() => { postContentChange('') }} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at, locale)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleEditStart} /> }
              </div>
              { editing
                ? <Resizable className="postText" tabIndex={2} placeholder={formatMessage(messages.writeHere)} onChange={value => { postContentChange(value) }} value={editingPost.content} />
                : <div className="postText" dangerouslySetInnerHTML={{ __html: textToElem(content) }} />
              }
            </div>
          </div>
        }

        { editing &&
          <div className="postButtons">
            <div className="left">
              <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
              { (postType === 'textPost' || postType === 'mixedPost') && <span style={{ marginRight: '8px' }}>{ remainCharCnts >= 0 ? remainCharCnts : 0 }</span> }
              { (postType !== 'mediaPost' && postType !== 'mixedPost') && <button type="button" className="postBorderBtn" onClick={() => { this.mediaUploader.click() }}>+ {formatMessage(messages.picture)}</button> }
              { (postType !== 'textPost' && postType !== 'mixedPost') && <button type="button" className="postBorderBtn" onClick={() => { postContentChange('') }}>+ {formatMessage(messages.text)}</button> }
            </div>
            { postType &&
              <div className="right">
                <button type="button" className="postCancelBtn" onClick={postEditEnd}>{formatMessage(messages.cancel)}</button>
                <DeleteButton className="postDeleteBtn" onClick={() => { postShowDeleteConfirm(!editingPost.showDeleteConfirm) }} onConfirm={() => { deletePostRequest(_id) }} showConfirm={showDeleteConfirm} />
                <button type="button" title={submitErrorTxt} className={cx({ postBorderBtn: true, disabled: !submittable })} disabled={!submittable} onClick={this.handleSubmit}>{formatMessage(messages.submit)}</button>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  editingPost: selectEditingPost(),
  info: selectHomeInfo(),
  locale: selectLocale(),
})

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

export default injectIntl(connect(selectors, actions)(Post))
