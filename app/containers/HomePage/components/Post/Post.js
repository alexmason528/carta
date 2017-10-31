import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import FileImage from 'react-file-image'
import className from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Popover, PopoverBody } from 'reactstrap'
import ContentEditable from 'components/ContentEditable'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { getTextFromDate } from 'utils/dateHelper'
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
      showDeleteConfirm: false,
      showLinkBar: false,
      showInfo: false,
      editable: false,
      editing: false,
      first: false,
      link: '',
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
        const fontSize = (width / 76) * 3
        $(post).find('.postTitle').css({ fontSize: `${fontSize}px` })
        $(post).find('.postTitleEdit').css({ fontSize: `${fontSize}px` })
      } else {
        const height = $(post).find('.postImage').height() - ($(post).hasClass('imagePost') ? 90 : 65)
        const fontSize = (width / 44) * 3
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
    })
  }

  handleCancel = () => {
    this.setState({
      ...this.props,
      showDeleteConfirm: false,
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
    })
  }

  handlePostContent = evt => {
    const value = evt.target.value
    this.setState({
      content: value.length > 0 ? value : '',
    })
  }

  handleDelete = () => {
    this.setState({
      showDeleteConfirm: !this.state.showDeleteConfirm,
    }, () => {
      this.handleResize()
    })
  }

  handlePostLinkBtn = evt => {
    evt.stopPropagation()
    this.setState({
      showLinkBar: !this.state.showLinkBar,
    })
  }

  handleDeleteConfirm = () => {
    const { _id } = this.state
    const { deletePostRequest, onPostEdit } = this.props
    deletePostRequest(_id)
    onPostEdit(false)
  }

  handlePostRemoveImage = () => {
    this.setState({
      img: null,
    }, () => {
      this.handleResize()
    })
  }

  handlePostRemoveContent = () => {
    this.setState({
      content: null,
    }, () => {
      this.handleResize()
    })
  }

  handleStartEdit = () => {
    this.setState({
      editing: true,
    }, () => {
      const { onPostEdit } = this.props
      this.handleResize()
      onPostEdit(true)
    })
  }

  handleSubmit = () => {
    const { content, img, title, link, _id } = this.state
    const { updatePostRequest } = this.props

    let data = {
      title,
      link,
      id: _id,
    }

    data.img = (img !== null) ? img : ''
    data.content = (content !== null) ? content : ''

    let formData = new FormData()

    for (let key in data) {
      formData.append(key, data[key])
    }

    const { onPostEdit } = this.props
    onPostEdit(false)
    this.handleResize()
    updatePostRequest(_id, formData)
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
      showDeleteConfirm: false,
      showLinkBar: false,
      showInfo: false,
    })
  }

  handleOpenLink = () => {
    const { link, editing } = this.state
    if (link && !editing) {
      window.open(link, '_blank')
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
      editable,
      showDeleteConfirm,
      showLinkBar,
      showInfo,
      editing,
      first,
      link,
    } = this.state

    let postType

    if (img && content !== null) {
      postType = 'normalPost'
    } else if (img && content === null) {
      postType = 'imagePost'
    } else if (!img && content !== null) {
      postType = 'textPost'
    }

    const postClass = className({
      post: true,
      firstPost: first && first === true,
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

    const canRemove = content && img
    const showPostRemoveImage = editing && canRemove && !showLinkBar
    const showPostRemoveContent = editable && editing && canRemove
    const showPostLinkButton = editing && !showLinkBar
    const showFileImage = img && (img instanceof File)
    const spinnerShow = (status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST) && (curPost === _id)

    return (
      <div style={{ position: 'relative' }}>
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        { postType === 'normalPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <div className="postImage" onClick={this.handleOpenLink}>
              { showFileImage ? <FileImage file={img} /> : <img src={img} role="presentation" /> }
              { showPostRemoveImage && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" onClick={this.handlePostRemoveImage} /> }
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              { showLinkBar &&
                <div className="postLinkBar" onClick={this.handlePostLinkBarClick}>
                  <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784802/image/icon/link.png" role="presentation" />
                  <input type="text" value={link} placeholder="PASTE OR WRITE LINK HERE" onChange={this.handlePostLinkBarChange} />
                </div>
              }
              { !editing && <div className="postTitle" onClick={this.handleOpenLink} dangerouslySetInnerHTML={{ __html: title ? title.replace(/\n/g, '<br />') : '' }} /> }
              { editing && <textarea className="postTitleEdit" placeholder="TITLE" onChange={this.handlePostTitle} value={title} /> }
            </div>
            <div className="postContent">
              { showPostRemoveContent && <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostRemoveContent} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              { editing && <textarea className="postText" onChange={this.handlePostContent} value={content} /> }
              { !editing && <div className="postText" dangerouslySetInnerHTML={{ __html: content ? content.replace(/\n/g, '<br/>') : '' }} />}
            </div>
          </div>
        }

        { postType === 'imagePost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <div className="postImage" onClick={this.handleOpenLink}>
              { editable && !editing && <EditButton className="postEditBtn" image="edit-white" onClick={this.handleStartEdit} /> }
              { showFileImage ? <FileImage file={img} /> : <img src={img} role="presentation" /> }
              { showPostRemoveImage && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" onClick={this.handlePostRemoveImage} /> }
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              { showLinkBar &&
                <div className="postLinkBar" onClick={this.handlePostLinkBarClick}>
                  <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784802/image/icon/link.png" role="presentation" />
                  <input type="text" value={link} placeholder="PASTE OR WRITE LINK HERE" onChange={this.handlePostLinkBarChange} />
                </div>
              }
            </div>
            { !editing && <div className="postTitle" onClick={this.handleOpenLink} dangerouslySetInnerHTML={{ __html: title ? title.replace(/\n/g, '<br />') : '' }} /> }
            { editing && <textarea className="postTitleEdit" placeholder="TITLE" onChange={this.handlePostTitle} value={title} /> }
            <div className={postInfoClass}>
              {username} - Carta | {getTextFromDate(created_at)}
            </div>
            <InfoButton className="postInfoBtn" onClick={this.handlePostInfoToggle} />
          </div>
        }

        { postType === 'textPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            { !editing && <div className="postTitle" dangerouslySetInnerHTML={{ __html: title ? title.replace(/\n/g, '<br />') : '' }} /> }
            { editing && <textarea className="postTitleEdit" placeholder="TITLE" onChange={this.handlePostTitle} value={title} /> }
            <div className="postContent">
              { showPostRemoveContent && <RemoveButton className="postRemoveCOntentBtn" image="close" onClick={this.handlePostRemoveContent} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              { !editing && <div className="postText" dangerouslySetInnerHTML={{ __html: content ? content.replace(/\n/g, '<br/>') : '' }} />}
              { editing && <textarea className="postText" onChange={this.handlePostContent} value={content} /> }
            </div>
          </div>
        }

        { editable && editing &&
          <div className="postButtons">
            <div className="left">
              <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
              {(postType === 'textPost' || postType === 'normalPost') &&
                <span style={{ marginRight: '8px' }}>{ content === true ? 1000 : (1000 - content.length) }</span>
              }
              {(postType !== 'imagePost' && postType !== 'normalPost') && <button type="button" className="postBorderBtn" onClick={this.handleAddMedia}>
                + MEDIA
              </button>}
              {(postType !== 'textPost' && postType !== 'normalPost') && <button type="button" className="postBorderBtn" onClick={this.handleAddText}>
                + TEXT
              </button>}
            </div>
            { postType &&
              <div className="right">
                <button type="button" className="postCancelBtn" onClick={this.handleCancel}>
                  CANCEL
                </button>
                <DeleteButton className="postDeleteBtn" onClick={this.handleDelete} onConfirm={this.handleDeleteConfirm} showConfirm={showDeleteConfirm} />
                <button type="button" className="postBorderBtn" onClick={this.handleSubmit}>
                  SUBMIT
                </button>
              </div>
            }
            <button type="button" className={closeButtonClass} onClick={onClose}>
              <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close.png" role="presentation" />
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
