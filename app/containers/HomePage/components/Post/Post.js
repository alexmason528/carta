import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import FileImage from 'react-file-image'
import className from 'classnames'
import axios from 'axios'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Popover, PopoverBody } from 'reactstrap'
import ContentEditable from 'components/ContentEditable'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { DeleteButton, EditButton, InfoButton, LinkButton, RemoveButton } from 'components/Buttons'
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { updatePostRequest, deletePostRequest } from 'containers/HomePage/actions'
import { UPDATE_POST_REQUEST, DELETE_POST_REQUEST } from 'containers/HomePage/constants'
import { selectHomeInfo } from 'containers/HomePage/selectors'
import { getTextFromDate } from 'utils/dateHelper'
import { elemToText, textToElem, getPostType } from 'utils/stringHelper'

import './style.scss'

class Post extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onPostEdit: PropTypes.func,
    updatePostRequest: PropTypes.func,
    deletePostRequest: PropTypes.func,
    info: PropTypes.object,
    show: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      showDeleteConfirm: false,
      showInfo: false,
      showLinkBar: false,
      editable: false,
      editing: false,
      link: '',
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
    const post = ReactDOM.findDOMNode(this)
    this.handleResize()
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
    }, () => {
      this.handleResize()
    })
  }

  handleResize = () => {
    const interval =
    setInterval(() => {
      const comp = ReactDOM.findDOMNode(this)
      const post = $(comp).find('.post')
      const width = $(post).width()
      if ($(post).hasClass('textPost')) {
        clearInterval(interval)
        const fontSize = (width / 76) * 3 * 1.15
        $(post).find('.postTitle').css({ fontSize: `${fontSize}px` })
        $(post).find('.postTitleEdit').css({ fontSize: `${fontSize}px` })
      } else {
        const height = $(post).find('.postImage').height() - ($(post).hasClass('mediaPost') ? 90 : 65)
        const fontSize = (width / 44) * 3 * 1.15
        const lines = fontSize > 0 ? Math.floor(height / (fontSize * 1.2)) : 0

        if (height > 0) clearInterval(interval)

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
    }, 0)
  }

  handleAddMedia = () => {
    this.mediaUploader.click()
  }

  handleFiles = evt => {
    this.setState({
      img: evt.target.files[0],
    }, () => {
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
    this.setState({
      content: value,
    })
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
      content: null,
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

    if (img instanceof File) {
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
    this.setState({
      showInfo: !this.state.showInfo,
    })
  }

  handlePostTitle = value => {
    this.setState({
      title: value,
    })
  }

  handlePostLinkBarClick = evt => {
    evt.stopPropagation()
  }

  handlePostLinkBarChange = evt => {
    evt.stopPropagation()

    this.setState({
      link: evt.target.value,
    })
  }

  handlePostClick = () => {
    this.setState({
      showDeleteConfirm: false,
      showLinkBar: false,
      showInfo: false,
    })
  }

  handleOpenLink = () => {
    const { link, editing, img } = this.state
    if (!editing) {
      if (!link) {
        window.location.href = img
      } else {
        window.location.href = (link.indexOf('http:') !== -1 || link.indexOf('https:') !== -1) ? link : `http://${link}`
      }
    }
  }

  handleEnterKey = evt => {
    if (evt.keyCode === 13) {
      this.setState({
        showLinkBar: false,
      })
    }
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
    } = this.state

    let postType = getPostType(img, content)

    const showPostLinkButton = editing && !showLinkBar
    const showFileImage = img && (img instanceof File)
    const spinnerShow = ((status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST) && (curPost === _id)) || imageUpload.uploading
    const submittable = title && (img || content)
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

    return (
      <div className="postContainer">
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        { postType === 'mixedPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <div className="postImage" onClick={this.handleOpenLink}>
              { showFileImage ? <FileImage file={img} /> : <img src={img} role="presentation" /> }
              { editing && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" hover onClick={this.handlePostImageRemove} /> }
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              <div className={postLinkBarClass} onClick={this.handlePostLinkBarClick}>
                <img onClick={this.handlePostLinkBtn} src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
                <input type="text" value={link} placeholder="Paste or write link here" onKeyDown={this.handleEnterKey} onChange={this.handlePostLinkBarChange} />
              </div>
              { editing
                ? <ContentEditable className="postTitleEdit" placeholder="Title" onChange={this.handlePostTitle} value={parsedTitle} />
                : <div className="postTitle" onClick={this.handleOpenLink}title={elemToText(title)} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
              }
            </div>
            <div className="postContent">
              { editing && <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostContentRemove} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              { editing
                ? <ContentEditable className="postText" placeholder="Write here..." onChange={this.handlePostContent} value={textToElem(content)} />
                : <div className="postText" dangerouslySetInnerHTML={{ __html: textToElem(content) }} />
              }
            </div>
          </div>
        }

        { postType === 'mediaPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <div className="postImage" onClick={this.handleOpenLink}>
              { editable && !editing && <EditButton className="postEditBtn" image="edit-white-shadow" hover onClick={this.handleStartEdit} /> }
              { showFileImage ? <FileImage file={img} /> : <img src={img} role="presentation" /> }
              { editing && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" onClick={this.handlePostImageRemove} /> }
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              <div className={postLinkBarClass} onClick={this.handlePostLinkBarClick}>
                <img onClick={this.handlePostLinkBtn} src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
                <input type="text" value={link} placeholder="Paste or write link here" onKeyDown={this.handleEnterKey} onChange={this.handlePostLinkBarChange} />
              </div>
            </div>
            { editing
              ? <ContentEditable className="postTitleEdit" placeholder="Title" onChange={this.handlePostTitle} value={parsedTitle} />
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
              ? <ContentEditable className="postTitleEdit" tabIndex="0" placeholder="Title" onChange={this.handlePostTitle} value={parsedTitle} />
              : <div className="postTitle" title={elemToText(title)} dangerouslySetInnerHTML={{ __html: textToElem(title) }} />
            }
            <div className="postContent">
              { editing && <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostContentRemove} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              { editing
                ? <ContentEditable className="postText" placeholder="Write here..." onChange={this.handlePostContent} value={textToElem(content)} />
                : <div className="postText" dangerouslySetInnerHTML={{ __html: textToElem(content) }} />
              }
            </div>
          </div>
        }

        { editable && editing &&
          <div className="postButtons">
            <div className="left">
              <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
              {(postType === 'textPost' || postType === 'mixedPost') &&
                <span style={{ marginRight: '8px' }}>{ content === true ? 1000 : (1000 - (content ? content.length : 0)) }</span>
              }
              {(postType !== 'mediaPost' && postType !== 'mixedPost') && <button type="button" className="postBorderBtn" onClick={this.handleAddMedia}>
                + Picture
              </button>}
              {(postType !== 'textPost' && postType !== 'mixedPost') && <button type="button" className="postBorderBtn" onClick={this.handleAddText}>
                + Text
              </button>}
            </div>
            { postType &&
              <div className="right">
                <button type="button" className="postCancelBtn" onClick={this.handleCancel}>CANCEL</button>
                <DeleteButton className="postDeleteBtn" onClick={this.handleDelete} onConfirm={this.handleDeleteConfirm} showConfirm={showDeleteConfirm} />
                <button type="button" className={submitBtnClass} disabled={!submittable} onClick={this.handleSubmit}>SUBMIT</button>
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
