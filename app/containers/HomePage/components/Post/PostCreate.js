import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import FileImage from 'react-file-image'
import className from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Popover, PopoverBody } from 'reactstrap'
import { DeleteButton, EditButton, InfoButton, LinkButton, RemoveButton } from 'components/Buttons'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { createPostRequest } from 'containers/HomePage/actions'
import { CREATE_POST_REQUEST, CREATE_POST_SUCCESS } from 'containers/HomePage/constants'
import { selectHomeInfo } from 'containers/HomePage/selectors'
import './style.scss'

class PostCreate extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    createPostRequest: PropTypes.func,
    user: PropTypes.object,
    info: PropTypes.object,
    show: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      img: null,
      content: null,
      title: '',
      link: '',
      showDeleteConfirm: false,
      showLinkBar: false,
      showInfo: false,
    }
  }

  componentDidMount() {
    const interval =
    setInterval(() => {
      const post = ReactDOM.findDOMNode(this)
      if ($(post).height() > 25) {
        this.handleResize()
        clearInterval(interval)
      }
    }, 0)

    window.addEventListener('resize', this.handleResize)
  }

  componentWillReceiveProps(nextProps) {
    const { info: { status } } = nextProps
    if (status === CREATE_POST_SUCCESS) {
      this.setState({
        img: null,
        content: null,
        title: '',
        link: '',
        showDeleteConfirm: false,
        showLinkBar: false,
        showInfo: false,
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const comp = ReactDOM.findDOMNode(this)
    const post = $(comp).find('.post')
    const width = $(post).width()

    if ($(post).hasClass('textPost')) {
      $(post).find('.postTitle').css({ fontSize: `${(width / 76) * 3}px` })
      $(post).find('.postTitleEdit').css({ fontSize: `${(width / 76) * 3}px` })
    } else {
      $(post).find('.postTitle').css({ fontSize: `${(width / 44) * 3}px` })
      $(post).find('.postTitleEdit').css({
        fontSize: `${(width / 44) * 3}px`,
        height: `${(width / 44) * 3 * 1.3 * 2}px`,
      })
    }
  }

  handleAddMedia = evt => {
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
      img: null,
      title: null,
      content: null,
      link: null,
    }, () => {
      this.handleResize()
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
    })
  }

  handlePostLinkBtn = evt => {
    evt.stopPropagation()
    this.setState({
      showLinkBar: !this.state.showLinkBar,
    })
  }

  handleDeleteConfirm = () => {
    this.handleCancel()
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

  handleSubmit = () => {
    const { content, img, title, link } = this.state
    const { createPostRequest, user } = this.props

    let data = {
      link,
      author: user._id,
    }

    data.img = (img !== null) ? img : ''
    data.content = (content !== null) ? content : ''
    data.title = (title !== null) ? title : ''

    let formData = new FormData()

    for (let key in data) {
      formData.append(key, data[key])
    }

    createPostRequest(formData)
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

  render() {
    const { show, onClose, user: { fullname }, info: { error, status } } = this.props
    const {
      img,
      title,
      content,
      link,
      showDeleteConfirm,
      showLinkBar,
      showInfo,
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
    const showPostRemoveImage = canRemove && !showLinkBar
    const showPostRemoveContent = canRemove
    const showPostLinkButton = !showLinkBar
    const showFileImage = img instanceof File
    const spinnerShow = status === CREATE_POST_REQUEST

    return (
      <div style={{ position: 'relative' }}>
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        { postType === 'normalPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <div className="postImage">
              { showFileImage && <FileImage file={img} /> }
              <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" onClick={this.handlePostRemoveImage} />
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              { showLinkBar &&
                <div className="postLinkBar" onClick={this.handlePostLinkBarClick}>
                  <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784802/image/icon/link.png" role="presentation" />
                  <input type="text" value={link} placeholder="PASTE OR WRITE LINK HERE" onChange={this.handlePostLinkBarChange} />
                </div>
              }
              <textarea className="postTitleEdit" placeholder="TITLE" onChange={this.handlePostTitle} value={title} />
            </div>
            <div className="postContent">
              <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostRemoveContent} />
              <div className="postMeta">
                {fullname} - CARTA | NOW
              </div>
              <textarea className="postText" onChange={this.handlePostContent} value={content} />
            </div>
          </div>
        }

        { postType === 'imagePost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <div className="postImage">
              { showFileImage ? <FileImage file={img} /> : <img src={img} role="presentation" /> }
              <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" onClick={this.handlePostRemoveImage} />
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              { showLinkBar &&
                <div className="postLinkBar" onClick={this.handlePostLinkBarClick}>
                  <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784802/image/icon/link.png" role="presentation" />
                  <input type="text" value={link} placeholder="PASTE OR WRITE LINK HERE" onChange={this.handlePostLinkBarChange} />
                </div>
              }
            </div>
            <textarea className="postTitleEdit" placeholder="TITLE" onChange={this.handlePostTitle} value={title} />
            <div className={postInfoClass}>
              {fullname} - Carta | NOW
            </div>
            <InfoButton className="postInfoBtn" onClick={this.handlePostInfoToggle} />
          </div>
        }

        { postType === 'textPost' &&
          <div className={postClass} onClick={this.handlePostClick}>
            <textarea className="postTitleEdit" placeholder="TITLE" onChange={this.handlePostTitle} value={title} />
            <div className="postContent">
              <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostRemoveContent} />
              <div className="postMeta">
                {fullname} - CARTA | NOW
              </div>
              <textarea className="postText" onChange={this.handlePostContent} value={content} />
            </div>
          </div>
        }

        <div className="postButtons postCreate">
          <div className="left">
            <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
            <button type="button" className="postBorderBtn" onClick={this.handleAddMedia}>+ MEDIA</button>
            <button type="button" className="postBorderBtn" onClick={this.handleAddText}>+ TEXT</button>
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
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  info: selectHomeInfo(),
})

const actions = {
  createPostRequest,
}

export default connect(selectors, actions)(PostCreate)
