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
import { updatePostRequest } from 'containers/HomePage/actions'
import { UPDATE_POST_REQUEST } from 'containers/HomePage/constants'
import { selectInfo } from 'containers/HomePage/selectors'
import { DeleteButton, EditButton, InfoButton, LinkButton, RemoveButton } from 'components/Buttons'
import './style.scss'

class Post extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    updatePostRequest: PropTypes.func,
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
    const interval =
    setInterval(() => {
      const post = ReactDOM.findDOMNode(this)
      if ($(post).find('.postImage').height() > 25) {
        $(post).find('.postTitle').dotdotdot({
          watch: 'window',
          ellipsis: ' ...',
        })
        this.handleResize()
        clearInterval(interval)
      }
    }, 0)

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
    })
  }

  handleResize = () => {
    const post = ReactDOM.findDOMNode(this)
    $(post).find('.postTitle').trigger('update.dot')
  }

  handleAddMedia = evt => {
    this.mediaUploader.click()
  }

  handleFiles = evt => {
    this.setState({
      img: evt.target.files[0],
    })
  }

  handleCancel = () => {
    this.setState({
      ...this.props,
      showDeleteConfirm: false,
      showLinkBar: false,
      showInfo: false,
      editing: false,
    })
  }

  handleAddText = () => {
    this.setState({
      content: '',
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
    })
  }

  handlePostLinkBtn = evt => {
    evt.stopPropagation()
    this.setState({
      showLinkBar: !this.state.showLinkBar,
    })
  }

  handleDeleteConfirm = () => {
    this.setState({
      img: null,
      title: null,
      content: null,
      showDeleteConfirm: false,
    })
  }

  handlePostRemoveImage = () => {
    this.setState({
      img: null,
    })
  }

  handlePostRemoveContent = () => {
    this.setState({
      content: null,
    })
  }

  handleStartEdit = () => {
    this.setState({
      editing: true,
    })
  }

  handleSubmit = () => {
    const { content, img, title, link, _id } = this.state
    const { updatePostRequest } = this.props

    let data = {
      title,
      link,
    }

    data.img = (img !== null) ? img : ''
    data.content = (content !== null) ? content : ''

    let formData = new FormData()

    for (let key in data) {
      formData.append(key, data[key])
    }

    updatePostRequest(_id, formData)
  }

  handlePostInfoToggle = () => {
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
    })
  }

  render() {
    const { show, onClose, info: { error, status } } = this.props
    const {
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
    const spinnerShow = status === UPDATE_POST_REQUEST

    return (
      <div style={{ position: 'relative' }}>
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        { postType === 'normalPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <div className="postImage">
              { showFileImage ? <FileImage file={img} /> : <img src={img} role="presentation" /> }
              { showPostRemoveImage && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" onClick={this.handlePostRemoveImage} /> }
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              { showLinkBar &&
                <div className="postLinkBar" onClick={this.handlePostLinkBarClick}>
                  <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784802/image/icon/link.png" role="presentation" />
                  <input type="text" value={link} placeholder="PASTE OR WRITE LINK HERE" onChange={this.handlePostLinkBarChange} />
                </div>
              }
              { !editing && <div className="postTitle" dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }} /> }
              { editing && <textarea className="postTitleEdit" placeholder="PASTE OR WRITE LINK HERE" onChange={this.handlePostTitle} value={title} /> }
            </div>
            <div className="postContent">
              { showPostRemoveContent && <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostRemoveContent} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              { editing && <textarea className="postText" onChange={this.handlePostContent} value={content} /> }
              { !editing && <div className="postText" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />}
            </div>
          </div>
        }

        { postType === 'imagePost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <div className="postImage">
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
            { !editing && <div className="postTitle" dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }} /> }
            { editing && <textarea className="postTitleEdit" onChange={this.handlePostTitle} value={title} /> }
            <div className={postInfoClass}>
              {username} - Carta | {getTextFromDate(created_at)}
            </div>
            <InfoButton className="postInfoBtn" onClick={this.handlePostInfoToggle} />
          </div>
        }

        { postType === 'textPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            { !editing && <div className="postTitle" dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }} /> }
            { editing && <textarea className="postTitleEdit" onChange={this.handlePostTitle} value={title} /> }
            <div className="postContent">
              { showPostRemoveContent && <RemoveButton className="removeContentButton" image="close" onClick={this.handlePostRemoveContent} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              { editing && <textarea className="postText" onChange={this.handlePostContent} value={content} /> }
              { !editing && <div className="postText" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />}
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
  info: selectInfo(),
})

const actions = {
  updatePostRequest,
}

export default connect(selectors, actions)(Post)
