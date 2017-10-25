import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import FileImage from 'react-file-image'
import className from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import { Popover, PopoverBody } from 'reactstrap'
import { getTextFromDate } from 'utils/dateHelper'
import ContentEditable from 'components/ContentEditable'
import { DeleteButton, EditButton, InfoButton, LinkButton, RemoveButton } from 'components/Buttons'
import './style.scss'

class Post extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    show: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      showDeleteConfirm: false,
      showInfo: false,
      editable: false,
      editing: false,
      first: false,
    }
  }

  componentWillMount() {
    this.initializeState(this.props)
  }

  componentDidMount() {
    const interval =
    setInterval(() => {
      const post = ReactDOM.findDOMNode(this)
      if ($(post).width() > 0) {
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
      showInfo: false,
      editing: false,
    })
  }

  handleAddText = () => {
    this.setState({
      content: '',
    })
  }

  handlePostContent = value => {
    this.setState({
      content: value.length > 0 ? value : '',
    })
  }

  handleDelete = () => {
    this.setState({
      showDeleteConfirm: !this.state.showDeleteConfirm,
    })
  }

  handlePostLinkBtn = () => {}

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
  }

  handlePostInfoToggle = () => {
    this.setState({
      showInfo: !this.state.showInfo,
    })
  }

  handlePostTitle = value => {
    this.setState({
      title: value,
    })
  }

  render() {
    const { show, onClose } = this.props
    const {
      img,
      title,
      content,
      created_at,
      username,
      editable,
      showDeleteConfirm,
      showInfo,
      editing,
      first,
      adding,
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
      firstPost: first,
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

    return (
      <div>
        { postType === 'normalPost' &&
          <div className={postClass}>
            <div className="postImage">
              { img && typeof (img) === 'string' && <img className="postImage" src={img} role="presentation" />}
              { img && typeof (img) === 'object' && <FileImage className="postImage" file={img} />}
              { editable && editing && canRemove && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" onClick={this.handlePostRemoveImage} /> }
              { editable && editing && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} /> }
              { !editing &&
                <div className="postTitle" title={title}>
                  {title}
                </div>
              }
              { editing && <ContentEditable editable={editing} className="postTitleEdit" onChange={this.handlePostTitle} content={title} /> }
            </div>
            <div className="postContent">
              { editable && editing && canRemove && <RemoveButton className="postRemoveContentBtn" image="close" onClick={this.handlePostRemoveContent} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              <ContentEditable editable={editing} className="postText" onChange={this.handlePostContent} content={content} />
            </div>
          </div>
        }

        { postType === 'imagePost' &&
          <div className={postClass}>
            <div className="postImage">
              { editable && !editing && <EditButton className="postEditBtn" image="edit-white" onClick={this.handleStartEdit} /> }
              { img && typeof (img) === 'string' && <img className="postImage" src={img} role="presentation" />}
              { img && typeof (img) === 'object' && <FileImage className="postImage" file={img} />}
              { editable && editing && canRemove && <RemoveButton className="postRemoveImageBtn" image="close-white-shadow" onClick={this.handlePostRemoveImage} /> }
              { editable && editing && <LinkButton className="postLinkBtn" onClick={this.handlePostLinkBtn} />}
            </div>
            { !editing &&
              <div className="postTitle" title={title}>
                {title}
              </div>
            }
            { editing && <ContentEditable editable={editing} className="postTitleEdit" onChange={this.handlePostTitle} content={title} /> }
            <div className={postInfoClass}>
              {username} - Carta | {getTextFromDate(created_at)}
            </div>
            <InfoButton className="postInfoBtn" onClick={this.handlePostInfoToggle} />
          </div>
        }

        { postType === 'textPost' &&
          <div className={postClass}>
            { !editing &&
              <div className="postTitle" title={title}>
                {title}
              </div>
            }
            { editing && <ContentEditable editable={editing} className="postTitleEdit" onChange={this.handlePostTitle} content={title} /> }
            <div className="postContent">
              { editable && editing && canRemove && <RemoveButton className="removeContentButton" image="close" onClick={this.handlePostRemoveContent} /> }
              <div className="postMeta">
                {username} - CARTA | {getTextFromDate(created_at)}
                { editable && !editing && <EditButton className="postEditBtn" image="edit" onClick={this.handleStartEdit} /> }
              </div>
              <ContentEditable editable={editing} className="postText" onChange={this.handlePostContent} content={content} />
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
              <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close.png" role="presentation" />
            </button>
          </div>
        }
      </div>
    )
  }
}

export default Post
