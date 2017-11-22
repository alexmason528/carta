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
import Resizable from 'components/Resizable'
import { createPostRequest } from 'containers/HomePage/actions'
import messages from 'containers/HomePage/messages'
import { CREATE_POST_REQUEST, CREATE_POST_SUCCESS } from 'containers/HomePage/constants'
import { selectHomeInfo } from 'containers/HomePage/selectors'
import { elemToText, textToElem } from 'utils/stringHelper'
import { getCroppedImage } from 'utils/imageHelper'
import './style.scss'

class PostCreate extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    createPostRequest: PropTypes.func,
    user: PropTypes.object,
    info: PropTypes.object,
    show: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      img: null,
      content: null,
      title: '',
      link: '',
      showInfo: false,
      showLinkBar: false,
      showDeleteConfirm: false,
      imageUpload: {
        uploading: false,
        error: null,
      },
    }
  }

  componentDidMount() {
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
        showInfo: false,
        showLinkBar: false,
        showDeleteConfirm: false,
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
      const fontSize = (width / 76) * 3 * 1.15
      $(post).find('.postTitleEdit').css({ fontSize: `${fontSize}px` })
    } else {
      const height = $(post).find('.postImage').height() - ($(post).hasClass('mediaPost') ? 90 : 60)
      const fontSize = (width / 44) * 3 * 1.15
      let lines = fontSize > 0 ? Math.floor(height / (fontSize * 1.2)) : 0

      $(post).find('.postTitleEdit').css({
        fontSize: `${fontSize}px`,
        'max-height': `${fontSize * lines * 1.2}px`,
      })
    }
  }

  handleAddMedia = evt => {
    this.mediaUploader.click()
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

  handlePostContent = value => {
    this.setState({ content: value })
  }

  handleDelete = () => {
    this.setState({ showDeleteConfirm: !this.state.showDeleteConfirm })
  }

  handleDeleteConfirm = () => {
    this.handleCancel()
  }

  handlePostLinkBtn = evt => {
    evt.stopPropagation()
    this.setState({ showLinkBar: !this.state.showLinkBar })
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

  handleSubmit = () => {
    const { content, img, title, link } = this.state
    const { createPostRequest, user } = this.props

    let data = {
      link,
      author: user._id,
      content: elemToText(content),
      title: elemToText(title),
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
      showInfo: false,
      showLinkBar: false,
      showDeleteConfirm: false,
    })
  }

  handleEnterKey = evt => {
    if (evt.keyCode === 13) {
      this.setState({ showLinkBar: false })
    }
  }

  render() {
    const { show, onClose, user: { fullname }, info: { error, status }, intl: { formatMessage } } = this.props
    const {
      img,
      title,
      content,
      link,
      showInfo,
      showLinkBar,
      showDeleteConfirm,
      imageUpload,
    } = this.state

    let postType

    if (img && content !== null) {
      postType = 'mixedPost'
    } else if (img && content === null) {
      postType = 'mediaPost'
    } else if (!img && content !== null) {
      postType = 'textPost'
    }

    const showPostLinkButton = !showLinkBar
    const showImage = status !== CREATE_POST_REQUEST
    const spinnerShow = status === CREATE_POST_REQUEST || imageUpload.uploading
    const remainCharCnts = !content ? 1000 : 1000 - content.length
    const submittable = title && (img || content) && (remainCharCnts >= 0)

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
          <div className={cx({ post: true, postCreate: true, [postType]: true })} onClick={this.handlePostClick}>
            <div className="postImage">
              { showImage && <img src={img} role="presentation" /> }
              <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" hover onClick={this.handlePostImageRemove} />
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              <div className={cx({ postLinkBar: true, 'postLinkBar--hidden': !showLinkBar })} onClick={this.handlePostLinkBarClick}>
                <img onClick={this.handlePostLinkBtn} src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
                <input type="text" value={link} placeholder={formatMessage(messages.linkMessage)} onKeyDown={this.handleEnterKey} onChange={this.handlePostLinkBarChange} />
              </div>
              <Resizable className="postTitleEdit" tabIndex={1} placeholder={formatMessage(messages.title)} onChange={this.handlePostTitle} value={title} />
            </div>
            <div className="postContent">
              <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostContentRemove} />
              <div className="postMeta">
                {fullname} - CARTA | {formatMessage(messages.now)}
              </div>
              <Resizable className="postText" tabIndex={2} placeholder={formatMessage(messages.writeHere)} onChange={this.handlePostContent} value={content} />
            </div>
          </div>
        }

        { postType === 'mediaPost' &&
          <div className={cx({ post: true, postCreate: true, [postType]: true })} onClick={this.handlePostClick}>
            <div className="postImage">
              { showImage && <img src={img} role="presentation" /> }
              <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" hover onClick={this.handlePostImageRemove} />
              { showPostLinkButton && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              <div className={cx({ postLinkBar: true, 'postLinkBar--hidden': !showLinkBar })} onClick={this.handlePostLinkBarClick}>
                <img onClick={this.handlePostLinkBtn} src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
                <input type="text" value={link} placeholder={formatMessage(messages.linkMessage)} onKeyDown={this.handleEnterKey} onChange={this.handlePostLinkBarChange} />
              </div>
            </div>
            <Resizable className="postTitleEdit" placeholder={formatMessage(messages.title)} onChange={this.handlePostTitle} value={title} />
            <div className={cx({ postInfo: true, 'postInfo--hidden': !showInfo })}>
              {fullname} - Carta | {formatMessage(messages.now)}
            </div>
            <InfoButton className={cx({ postInfoBtn: true, active: showInfo })} onClick={this.handlePostInfoToggle} />
          </div>
        }

        { postType === 'textPost' &&
          <div className={cx({ post: true, postCreate: true, [postType]: true })} onClick={this.handlePostClick}>
            <Resizable className="postTitleEdit" tabIndex={1} placeholder={formatMessage(messages.title)} onChange={this.handlePostTitle} value={title} />
            <div className="postContent">
              <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostContentRemove} />
              <div className="postMeta">
                {fullname} - CARTA | {formatMessage(messages.now)}
              </div>
              <Resizable className="postText" tabIndex={2} placeholder={formatMessage(messages.writeHere)} onChange={this.handlePostContent} value={content} />
            </div>
          </div>
        }

        <div className="postButtons postCreate">
          <div className="left">
            <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
            { (postType === 'textPost' || postType === 'mixedPost') && <span style={{ marginRight: '8px' }}>{ remainCharCnts >= 0 ? remainCharCnts : 0 }</span> }
            { (postType !== 'mediaPost' && postType !== 'mixedPost') && <button type="button" className="postBorderBtn" onClick={this.handleAddMedia}>+ {formatMessage(messages.picture)}</button> }
            { (postType !== 'textPost' && postType !== 'mixedPost') && <button type="button" className="postBorderBtn" onClick={this.handleAddText}>+ {formatMessage(messages.text)}</button> }
          </div>
          { postType &&
            <div className="right">
              <button type="button" className="postCancelBtn" onClick={this.handleCancel}>{formatMessage(messages.cancel)}</button>
              <DeleteButton className="postDeleteBtn" onClick={this.handleDelete} onConfirm={this.handleDeleteConfirm} showConfirm={showDeleteConfirm} />
              <button type="button" title={submitErrorTxt} className={cx({ postBorderBtn: true, disabled: !submittable })} disabled={!submittable} onClick={this.handleSubmit}>{formatMessage(messages.submit)}</button>
            </div>
          }
          <button type="button" className={cx({ postCloseBtn: true, 'postCloseBtn--hasContent': postType })} onClick={onClose}>
            <img src={`${CLOUDINARY_ICON_URL}/close.png`} role="presentation" />
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

export default injectIntl(connect(selectors, actions)(PostCreate))
