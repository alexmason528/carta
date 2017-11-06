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
import { getTextFromDate } from 'utils/dateHelper'
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { updatePostRequest, deletePostRequest } from 'containers/HomePage/actions'
import { UPDATE_POST_REQUEST, DELETE_POST_REQUEST } from 'containers/HomePage/constants'
import { selectHomeInfo } from 'containers/HomePage/selectors'
import { DeleteButton, EditButton, InfoButton, LinkButton, RemoveButton } from 'components/Buttons'
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
      showLinkBar: false,
      showInfo: false,
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
          height: `${fontSize * lines * 1.2}px`,
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

  handlePostContent = evt => {
    const value = evt.target.value
    this.setState({
      content: value.length > 0 ? value : '',
    })
  }

  handleDelete = () => {
    const { _id } = this.state
    const { deletePostRequest, onPostEdit } = this.props
    deletePostRequest(_id)
    onPostEdit(false)
    this.handleResize()
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
      title,
      link,
      content: content !== null ? content : '',
      id: _id,
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

  handlePostTitle = evt => {
    this.setState({
      title: evt.target.value,
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

  render() {
    const { show, onClose, onPostEdit, info: { error, status, curPost } } = this.props
    const {
      _id,
      img,
      title,
      content,
      created_at,
      username,
      showLinkBar,
      showInfo,
      editable,
      editing,
      link,
      imageUpload,
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

    const postClass = className({
      post: true,
      'post--editing': editing,
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

    const canRemove = content && img
    const showPostRemoveImage = editing && canRemove
    const showPostRemoveContent = editable && editing && canRemove
    const showPostLinkButton = editing && !showLinkBar
    const showFileImage = img && (img instanceof File)
    const spinnerShow = ((status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST) && (curPost === _id)) || imageUpload.uploading

    return (
      <div className="postContainer">
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        { postType === 'mixedPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <div className="postImage" onClick={this.handleOpenLink}>
              { showFileImage ? <FileImage file={img} /> : <img src={img} role="presentation" /> }
              { showPostRemoveImage && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" onClick={this.handlePostImageRemove} /> }
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              { showLinkBar &&
                <div className="postLinkBar" onClick={this.handlePostLinkBarClick}>
                  <img src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
                  <input type="text" value={link} placeholder="PASTE OR WRITE LINK HERE" onChange={this.handlePostLinkBarChange} />
                </div>
              }
              { editing
                ? <textarea className="postTitleEdit" placeholder="TITLE" onChange={this.handlePostTitle} value={title} />
                : <div className="postTitle" onClick={this.handleOpenLink} dangerouslySetInnerHTML={{ __html: title ? title.replace(/\n/g, '<br />') : '' }} />
              }
            </div>
            <div className="postContent">
              { showPostRemoveContent && <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostContentRemove} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              { editing
                ? <textarea className="postText" placeholder="Write here..." onChange={this.handlePostContent} value={content} />
                : <div className="postText" dangerouslySetInnerHTML={{ __html: content ? content.replace(/\n/g, '<br/>') : '' }} />
              }
            </div>
          </div>
        }

        { postType === 'mediaPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <div className="postImage" onClick={this.handleOpenLink}>
              { editable && !editing && <EditButton className="postEditBtn" image="edit-white-shadow" onClick={this.handleStartEdit} /> }
              { showFileImage ? <FileImage file={img} /> : <img src={img} role="presentation" /> }
              { showPostRemoveImage && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" onClick={this.handlePostImageRemove} /> }
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              { showLinkBar &&
                <div className="postLinkBar" onClick={this.handlePostLinkBarClick}>
                  <img src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
                  <input type="text" value={link} placeholder="PASTE OR WRITE LINK HERE" onChange={this.handlePostLinkBarChange} />
                </div>
              }
            </div>
            { editing
              ? <textarea className="postTitleEdit" placeholder="TITLE" onChange={this.handlePostTitle} value={title} />
              : <div className="postTitle" onClick={this.handleOpenLink} dangerouslySetInnerHTML={{ __html: title ? title.replace(/\n/g, '<br />') : '' }} />
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
              ? <textarea className="postTitleEdit" placeholder="TITLE" onChange={this.handlePostTitle} value={title} />
              : <div className="postTitle" dangerouslySetInnerHTML={{ __html: title ? title.replace(/\n/g, '<br />') : '' }} />
            }
            <div className="postContent">
              { showPostRemoveContent && <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostContentRemove} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              { editing
                ? <textarea className="postText" placeholder="Write here..." onChange={this.handlePostContent} value={content} />
                : <div className="postText" dangerouslySetInnerHTML={{ __html: content ? content.replace(/\n/g, '<br/>') : '' }} />
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
                + TEXT
              </button>}
            </div>
            { postType &&
              <div className="right">
                <button type="button" className="postCancelBtn" onClick={this.handleCancel}>CANCEL</button>
                <DeleteButton className="postDeleteBtn" onClick={this.handleDelete} />
                <button type="button" className="postBorderBtn" onClick={this.handleSubmit}>SUBMIT</button>
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
