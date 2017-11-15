import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import className from 'classnames'
import axios from 'axios'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Popover, PopoverBody } from 'reactstrap'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { DeleteButton, EditButton, InfoButton, LinkButton, RemoveButton } from 'components/Buttons'
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { updatePostRequest, deletePostRequest } from 'containers/HomePage/actions'
import { UPDATE_POST_REQUEST, DELETE_POST_REQUEST } from 'containers/HomePage/constants'
import { selectHomeInfo } from 'containers/HomePage/selectors'
import { getTextFromDate } from 'utils/dateHelper'
import { elemToText, textToElem } from 'utils/stringHelper'
import { getCroppedImage } from 'utils/imageHelper'
import Resizable from 'components/Resizable'
import './style.scss'

class Post extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onPostEdit: PropTypes.func,
    updatePostRequest: PropTypes.func,
    deletePostRequest: PropTypes.func,
    info: PropTypes.object,
    show: PropTypes.bool,
    content: PropTypes.string,
    img: PropTypes.string,
  }

  constructor(props) {
    super(props)

    const { img, content } = props

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

    this.state = {
      showDeleteConfirm: false,
      showInfo: false,
      showLinkBar: false,
      editable: false,
      editing: false,
      link: '',
      imageLoaded: postType === 'textPost',
      imageUpload: {
        uploading: false,
        error: null,
      },
    }
  }

  componentWillMount() {
    this.initializeState(this.props)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillReceiveProps(nextProps) {
    this.initializeState(nextProps)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  initializeState(props) {
    this.setState({
      ...props,
      editing: false,
      showLinkBar: false,
    }, this.handleResize)
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

  handleAddMedia = () => {
    this.mediaUploader.click()
  }

  handleFiles = evt => {
    const file = evt.target.files[0]
    getCroppedImage(file, this.handleImage, 'landscape')
  }

  handleImage = (img, type) => {
    this.setState({ img }, () => {
      this.handleResize()
      const comp = ReactDOM.findDOMNode(this)
      $(comp).find('.postTitleEdit').focus()
    })
  }

  handleCancel = () => {
    this.setState({
      ...this.props,
      showLinkBar: false,
      showInfo: false,
      editing: false,
    }, () => {
      const { onPostEdit } = this.props
      this.handleResize()
      onPostEdit(false)
    })
  }

  handleAddText = () => {
    this.setState({
      content: '',
    }, () => {
      this.handleResize()
      const comp = ReactDOM.findDOMNode(this)
      if ($(comp).find('.postImage').length > 0) {
        $(comp).find('.postText').focus()
      } else {
        $(comp).find('.postTitleEdit').focus()
      }
    })
  }

  handlePostContent = value => {
    this.setState({ content: value })
  }

  handleDelete = () => {
    this.setState({
      showDeleteConfirm: !this.state.showDeleteConfirm,
    }, () => {
      this.handleResize()
    })
  }

  handleDeleteConfirm = () => {
    const { _id } = this.state
    const { deletePostRequest, onPostEdit } = this.props
    deletePostRequest(_id)
    onPostEdit(false)
  }

  handlePostLinkBtn = evt => {
    evt.stopPropagation()
    this.setState({
      showLinkBar: !this.state.showLinkBar,
    })
  }

  handlePostImageRemove = () => {
    this.setState({
      img: null,
    }, () => {
      this.handleResize()
      const comp = ReactDOM.findDOMNode(this)
      $(comp).find('.postText').focus()
    })
  }

  handlePostContentRemove = () => {
    this.setState({
      content: '',
    }, () => {
      this.handleResize()
      const comp = ReactDOM.findDOMNode(this)
      $(comp).find('.postTitleEdit').focus()
    })
  }

  handleStartEdit = () => {
    this.setState({
      editing: true,
    }, () => {
      const { onPostEdit } = this.props
      this.handleResize()
      const comp = ReactDOM.findDOMNode(this)
      $(comp).find('.postTitleEdit').focus()
      onPostEdit(true)
    })
  }

  handleSubmit = () => {
    const { content, img, title, link, _id } = this.state
    const { updatePostRequest } = this.props

    let data = {
      link,
      id: _id,
      title: elemToText(title),
      content: elemToText(content),
    }

    const { onPostEdit } = this.props
    onPostEdit(false)
    this.handleResize()

    if (img && img.indexOf('data:image') !== -1) {
      this.setState({
        imageUpload: {
          uploading: true,
          error: null,
        },
      })

      let formData = new FormData()
      formData.append('file', img)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(res => {
        const { data: { url } } = res
        this.setState({
          imageUpload: {
            uploading: false,
            error: null,
          },
        })

        data.img = url
        updatePostRequest(_id, data)
      }).catch(err => {
        this.setState({
          imageUpload: {
            uploading: false,
            error: err.toString(),
          },
        })
      })
    } else {
      data.img = img !== null ? img : ''
      updatePostRequest(_id, data)
    }
  }

  handlePostInfoToggle = evt => {
    evt.stopPropagation()
    this.setState({ showInfo: !this.state.showInfo })
  }

  handlePostTitle = value => {
    this.setState({ title: value })
  }

  handlePostLinkBarClick = evt => {
    evt.stopPropagation()
  }

  handlePostLinkBarChange = evt => {
    evt.stopPropagation()

    this.setState({ link: evt.target.value })
  }

  handlePostClick = () => {
    this.setState({
      showDeleteConfirm: false,
      showLinkBar: false,
      showInfo: false,
    })
  }

  handleEnterKey = evt => {
    if (evt.keyCode === 13) { this.setState({ showLinkBar: false }) }
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  render() {
    const { show, onClose, onPostEdit, info: { error, status, curPost } } = this.props
    const {
      _id,
      img,
      title,
      content,
      created_at,
      username,
      showDeleteConfirm,
      showLinkBar,
      showInfo,
      editable,
      editing,
      link,
      imageUpload,
      imageLoaded,
    } = this.state

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

    const showPostLinkButton = editing && !showLinkBar
    const showImage = status !== UPDATE_POST_REQUEST
    const spinnerShow = ((status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST) && (curPost === _id)) || imageUpload.uploading
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
      submitErrorTxt = 'Please add a title'
    } else if (!img && !content) {
      submitErrorTxt = 'Please add text or an image'
    } else if (remainCharCnts < 0) {
      submitErrorTxt = 'Please post a text less than 1000 characters'
    }

    let parsedTitle = title ? title.replace(/\n/g, '</div><div>') : ''

    const postClass = className({
      post: true,
      [postType]: true,
    })

    const closeButtonClass = className({
      postCloseBtn: true,
      'postCloseBtn--hasContent': postType,
    })

    const postInfoClass = className({
      postInfo: true,
      'postInfo--hidden': !showInfo,
    })

    const postInfoBtnClass = className({
      postInfoBtn: true,
      active: showInfo,
    })

    const postLinkBarClass = className({
      postLinkBar: true,
      'postLinkBar--hidden': !showLinkBar,
    })

    const submitBtnClass = className({
      postBorderBtn: true,
      disabled: !submittable,
    })

    const postContainerClass = className({
      postContainer: true,
      hidden: !imageLoaded,
    })

    return (
      <div className={postContainerClass}>
        { (showLinkBar || showInfo || showDeleteConfirm) && <div className="backLayer" onClick={this.handlePostClick} /> }
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        { postType === 'mixedPost' &&
          <div className={postClass}>
            <a className="postImage" href={postLink}>
              { showImage &&
                <div>
                  <img className="postImage__hoverImg" onLoad={this.handleLoaded} src={img} role="presentation" />
                  <img src={img} role="presentation" />
                </div>
              }
              { editing && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" hover onClick={this.handlePostImageRemove} /> }
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              <div className={postLinkBarClass} onClick={this.handlePostLinkBarClick}>
                <img onClick={this.handlePostLinkBtn} src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
                <input type="text" value={link} placeholder="Paste or write link here" onKeyDown={this.handleEnterKey} onChange={this.handlePostLinkBarChange} />
              </div>
              { editing
                ? <Resizable className="postTitleEdit" tabIndex={1} placeholder="Title" onChange={this.handlePostTitle} value={title} />
                : <div className="postTitle" onClick={this.handleOpenLink} title={elemToText(title)} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
              }
            </a>
            <div className="postContent">
              { editing && <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostContentRemove} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              { editing
                ? <Resizable className="postText" tabIndex={2} placeholder="Write here..." onChange={this.handlePostContent} value={content} />
                : <div className="postText" dangerouslySetInnerHTML={{ __html: textToElem(content) }} />
              }
            </div>
          </div>
        }

        { postType === 'mediaPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <a className="postImage" href={postLink}>
              { editable && !editing && <EditButton className="postEditBtn" image="edit-white-shadow" hover onClick={this.handleStartEdit} /> }
              { showImage &&
                <div>
                  <img className="postImage__hoverImg" onLoad={this.handleLoaded} src={img} role="presentation" />
                  <img src={img} role="presentation" />
                </div>
              }
              { editing && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" hover onClick={this.handlePostImageRemove} /> }
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              <div className={postLinkBarClass} onClick={this.handlePostLinkBarClick}>
                <img onClick={this.handlePostLinkBtn} src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
                <input type="text" value={link} placeholder="Paste or write link here" onKeyDown={this.handleEnterKey} onChange={this.handlePostLinkBarChange} />
              </div>
            </a>
            { editing
              ? <Resizable className="postTitleEdit" placeholder="Title" onChange={this.handlePostTitle} value={title} />
              : <div className="postTitle" title={elemToText(title)} onClick={this.handleOpenLink} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
            }
            <div className={postInfoClass}>
              {username} - Carta | {getTextFromDate(created_at)}
            </div>
            <InfoButton className={postInfoBtnClass} onClick={this.handlePostInfoToggle} />
          </div>
        }

        { postType === 'textPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            { editing
              ? <Resizable className="postTitleEdit" tabIndex={1} placeholder="Title" onChange={this.handlePostTitle} value={title} />
              : <div className="postTitle" title={elemToText(title)} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
            }
            <div className="postContent">
              { editing && <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostContentRemove} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              { editing
                ? <Resizable className="postText" tabIndex={2} placeholder="Write here..." onChange={this.handlePostContent} value={content} />
                : <div className="postText" dangerouslySetInnerHTML={{ __html: textToElem(content) }} />
              }
            </div>
          </div>
        }

        { editable && editing &&
          <div className="postButtons">
            <div className="left">
              <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
              { (postType === 'textPost' || postType === 'mixedPost') && <span style={{ marginRight: '8px' }}>{ remainCharCnts >= 0 ? remainCharCnts : 0 }</span> }
              { (postType !== 'mediaPost' && postType !== 'mixedPost') && <button type="button" className="postBorderBtn" onClick={this.handleAddMedia}>+ Picture</button> }
              { (postType !== 'textPost' && postType !== 'mixedPost') && <button type="button" className="postBorderBtn" onClick={this.handleAddText}>+ Text</button> }
            </div>
            { postType &&
              <div className="right">
                <button type="button" className="postCancelBtn" onClick={this.handleCancel}>CANCEL</button>
                <DeleteButton className="postDeleteBtn" onClick={this.handleDelete} onConfirm={this.handleDeleteConfirm} showConfirm={showDeleteConfirm} />
                <button type="button" title={submitErrorTxt} className={submitBtnClass} disabled={!submittable} onClick={this.handleSubmit}>SUBMIT</button>
              </div>
            }
            <button type="button" className={closeButtonClass} onClick={onClose}>
              <img src={`${CLOUDINARY_ICON_URL}/close.png`} role="presentation" />
            </button>
          </div>
        }
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  info: selectHomeInfo(),
})

const actions = {
  updatePostRequest,
  deletePostRequest,
}

export default connect(selectors, actions)(Post)
