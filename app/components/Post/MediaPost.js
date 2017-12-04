import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import cx from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { LANGUAGES, LANGUAGE_CONST } from 'containers/LanguageProvider/constants'
import {
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAIL,
  DELETE_POST_REQUEST,
} from 'containers/HomePage/constants'
import messages from 'containers/HomePage/messages'
import { DeleteButton, EditButton, InfoButton, LinkButton, RemoveButton } from 'components/Buttons'
import Img from 'components/Img'
import LoadingSpinner from 'components/LoadingSpinner'
import Resizable from 'components/Resizable'
import { QuarterSpinner } from 'components/SvgIcon'
import { getTextFromDate } from 'utils/dateHelper'
import { getCroppedImage } from 'utils/imageHelper'
import { textToElem, getDefaultTexts, getPostLink, getSubmitInfo, isLanguageSelectable } from 'utils/stringHelper'
import LinkBar from './LinkBar'
import './style.scss'

class MediaPost extends Component {
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
    intl: intlShape.isRequired,
    _id: PropTypes.string,
    title: PropTypes.object,
    img: PropTypes.string,
    content: PropTypes.object,
    link: PropTypes.string,
    firstname: PropTypes.string,
    created_at: PropTypes.string,
    editing: PropTypes.bool,
    editable: PropTypes.bool,
    showDeleteConfirm: PropTypes.bool,
    showLinkBar: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      showError: false,
      showInfo: false,
      locale: props.intl.locale,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillReceiveProps(nextProps) {
    const { info: { status }, intl: { locale } } = nextProps

    if (status !== this.props.info.status && (status === UPDATE_POST_SUCCESS || status === UPDATE_POST_FAIL)) {
      this.setState({ locale }, this.handleResize)
    }

    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const { editing } = this.props
    const post = ReactDOM.findDOMNode(this)
    const width = $(post).width()
    const height = $(post).find('.postImage').height() - 65
    const fontSize = (width / 44) * 3 * 1.15
    const lines = fontSize > 0 ? Math.floor(height / (fontSize * 1.2)) : 0
    const maxHeight = fontSize * lines * 1.2

    const $title = editing ? $(post).find('.postTitleEdit') : $(post).find('.postTitle')
    $title.css({
      fontSize: `${fontSize}px`,
      maxHeight: `${maxHeight}px`,
      height: 'auto',
    })

    if (!editing) {
      $title.css({ '-webkit-line-clamp': lines.toString() })
    }
    let sH = $title.prop('scrollHeight')
    $title.css({ height: `${sH}px` })
  }

  handleEditStart = evt => {
    evt.stopPropagation()
    const { _id, title, content, img, link } = this.props
    const data = { _id, title, content, img, link, showDeleteConfirm: false, showLinkBar: false }
    this.props.postEditStart(data)
    this.setState({ showError: false }, this.handleResize)
  }

  handlePostInfoToggle = evt => {
    evt.stopPropagation()
    this.setState({
      showError: false,
      showInfo: !this.state.showInfo,
    })
  }

  handleBackLayerClick = () => {
    if (this.props.showDeleteConfirm) {
      this.props.postShowDeleteConfirm(false)
    }
    if (this.props.showLinkBar) {
      this.props.postShowLinkBar(false)
    }
    this.setState({
      showError: false,
      showInfo: false,
    })
  }

  handleLinkButtonClick = evt => {
    this.props.postShowLinkBar(!this.props.showLinkBar)
    this.setState({ showError: false })
  }

  handleAddText = () => {
    this.props.postContentChange(LANGUAGE_CONST)
  }

  handlePostRemoveImage = () => {
    this.props.postImageChange(null)
    this.props.postContentChange(LANGUAGE_CONST)
  }

  handleDelete = () => {
    this.props.postShowDeleteConfirm(!this.props.showDeleteConfirm)
    this.setState({ showError: false })
  }

  handleDeleteConfirm = () => {
    this.props.deletePostRequest(this.props._id)
  }

  handleTitleChange = value => {
    const { title } = this.props
    const { locale } = this.state
    this.props.postTitleChange({
      ...title,
      [locale]: value,
    })
  }

  handlePostImageClick = evt => {
    const { editing, link, img } = this.props
    let postLink = getPostLink(editing, link, img)
    if (postLink === '#') { evt.preventDefault() }
  }

  handlePostLanguageChange = evt => {
    this.setState({
      locale: evt.target.value,
      showError: false,
    }, this.handleResize)
  }

  handleSubmit = submitError => {
    if (submitError) {
      this.setState({ showError: true })
      return
    }
    this.setState({ showError: false })
    this.props.updatePostRequest()
  }

  handleCancel = () => {
    const { intl: { locale } } = this.props
    this.props.postEditEnd()
    this.setState({ locale }, this.handleResize)
  }

  render() {
    const {
      img,
      title,
      content,
      link,
      firstname,
      created_at,
      editing,
      editable,
      showLinkBar,
      showDeleteConfirm,
      info: { error, status },
      intl: { formatMessage },
      postShowLinkBar,
      postLinkChange,
      postEditEnd,
      deletePostRequest,
      updatePostRequest,
    } = this.props

    const { showError, showInfo, locale } = this.state

    const showPostLinkButton = editing && !showLinkBar
    const spinnerShow = editing && (status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST)
    const defaultTexts = getDefaultTexts(locale, this.props.intl.locale)
    const dropdownDisabled = !isLanguageSelectable(title, img, content, this.props.intl.locale)
    const { postType, remainCharCnts, submitError } = getSubmitInfo(title, img, content, this.props.intl.locale, locale, formatMessage)

    let postLink = getPostLink(editing, link, img)

    const linkBarProps = { link, showLinkBar, postShowLinkBar, postLinkChange }

    return (
      <div className="postContainer">
        { (showLinkBar || showInfo || showDeleteConfirm) && <div className="backLayer" onClick={this.handleBackLayerClick} /> }
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>
        <div className="post mediaPost">
          <a className={cx({ postImage: true, noLink: !link })} href={postLink} onClick={this.handlePostImageClick}>
            <Img onLoad={this.handleResize} src={img} />
            { editing
              ? <Resizable className="postTitleEdit" placeholder={defaultTexts.title} onChange={this.handleTitleChange} value={title[locale]} />
              : <div className="postTitle" title={title[locale]} onClick={this.handleOpenLink} dangerouslySetInnerHTML={{ __html: textToElem(title[locale]) }} />
            }
          </a>
          <div className={cx({ postInfo: true, 'postInfo--hidden': !showInfo })}>
            { firstname } - Carta | {getTextFromDate(created_at, locale)}
          </div>
          <LinkBar {...linkBarProps} />
          { editable && !editing && <EditButton white onClick={this.handleEditStart} /> }
          { editing && <RemoveButton type="image" onClick={this.handlePostRemoveImage} /> }
          { showPostLinkButton && <LinkButton onClick={this.handleLinkButtonClick} /> }
          <InfoButton active={showInfo} onClick={this.handlePostInfoToggle} />
        </div>

        { editing &&
          <div className="postButtons">
            <div className="left">
              <button type="button" className="postBorderBtn" onClick={this.handleAddText}>+ {formatMessage(messages.text)}</button>
              <div className={cx({ postLang: true, disabled: dropdownDisabled })}>
                <select onChange={this.handlePostLanguageChange} disabled={dropdownDisabled} value={locale}>
                  { LANGUAGES.map(lang => <option key={lang.countryCode} value={lang.countryCode}>{lang.countryCode}</option>)}
                </select>
              </div>
            </div>
            <div className="right">
              <button type="button" className="postCancelBtn" onClick={this.handleCancel}>{formatMessage(messages.cancel)}</button>
              <DeleteButton onClick={this.handleDelete} onConfirm={this.handleDeleteConfirm} showConfirm={showDeleteConfirm} />
              <button type="button" className={cx({ postBorderBtn: true, disabled: submitError })} title={submitError} onClick={() => { this.handleSubmit(submitError) }}>{formatMessage(messages.submit)}</button>
            </div>
          </div>
        }
        { showError && submitError && <div className="error">{submitError}</div>}
      </div>
    )
  }
}

export default injectIntl(MediaPost)
