import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import FileImage from 'react-file-image'
import className from 'classnames'
import axios from 'axios'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Popover, PopoverBody } from 'reactstrap'
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from 'containers/App/constants'
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
      imageUpload: {
        uploading: false,
        error: null,
      },
    }
  }

  componentDidMount() {
    this.handleResize()
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
    const interval =
    setInterval(() => {
      const comp = ReactDOM.findDOMNode(this)
      const post = $(comp).find('.post')
      const width = $(post).width()

      if ($(post).hasClass('textPost')) {
        const fontSize = (width / 76) * 3 * 1.15
        $(post).find('.postTitleEdit').css({ fontSize: `${fontSize}px` })
        clearInterval(interval)
      } else {
        const height = $(post).find('.postImage').height() - ($(post).hasClass('imagePost') ? 90 : 60)
        const fontSize = (width / 44) * 3 * 1.15
        let lines = fontSize > 0 ? Math.floor(height / (fontSize * 1.2)) : 0

        if (height > 0) clearInterval(interval)

        $(post).find('.postTitleEdit').css({
          fontSize: `${fontSize}px`,
          height: `${fontSize * lines * 1.2}px`,
        })
      }
    }, 0)
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
    const { onClose } = this.props
    this.setState({
      img: null,
      title: null,
      content: null,
      link: null,
    }, () => {
      this.handleResize()
      onClose()
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
      content: content !== null ? content : '',
      title: title !== null ? title : '',
      img: '',
    }

    this.setState({
      imageUpload: {
        uploading: true,
        error: null,
      },
    })

    if (img) {
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
        createPostRequest(data)
      }).catch(err => {
        this.setState({
          imageUpload: {
            uploading: false,
            error: err.toString(),
          },
        })
      })
    } else {
      createPostRequest(data)
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
      imageUpload,
    } = this.state

    let postType

    if (img && content !== null) {
      postType = 'normalPost'
    } else if (img && content === null) {
      postType = 'imagePost'
    } else if (!img && content !== null) {
      postType = 'textPost'
    }

    const showPostLinkButton = !showLinkBar
    const showFileImage = img instanceof File
    const spinnerShow = status === CREATE_POST_REQUEST || imageUpload.uploading
    const submittable = title || content

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

    const submitBtnClass = className({
      postBorderBtn: true,
      disabled: !submittable,
    })

    const postInfoBtnClass = className({
      postInfoBtn: true,
      active: showInfo,
    })

    return (
      <div className="postContainer">
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
            <InfoButton className={postInfoBtnClass} onClick={this.handlePostInfoToggle} />
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
              <button type="button" className={submitBtnClass} disabled={!submittable} onClick={this.handleSubmit}>
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
