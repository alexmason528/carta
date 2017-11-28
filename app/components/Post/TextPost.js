import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import cx from 'classnames'
import { createStructuredSelector } from 'reselect'
import { LANGUAGES } from 'containers/App/constants'
import { UPDATE_POST_REQUEST, DELETE_POST_REQUEST } from 'containers/HomePage/constants'
import messages from 'containers/HomePage/messages'
import { DeleteButton, EditButton, RemoveButton } from 'components/Buttons'
import LoadingSpinner from 'components/LoadingSpinner'
import Resizable from 'components/Resizable'
import { QuarterSpinner } from 'components/SvgIcon'
import { getTextFromDate } from 'utils/dateHelper'
import { getCroppedImage } from 'utils/imageHelper'
import { getDefaultTexts, getSubmitInfo, isLanguageSelectable } from 'utils/stringHelper'
import './style.scss'

class TextPost extends Component {
  static propTypes = {
    updatePostRequest: PropTypes.func,
    deletePostRequest: PropTypes.func,
    postEditStart: PropTypes.func,
    postShowDeleteConfirm: PropTypes.func,
    postTitleChange: PropTypes.func,
    postImageChange: PropTypes.func,
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
  }

  constructor(props) {
    super(props)

    this.state = {
      locale: props.intl.locale,
      showError: false,
    }
  }

  handleEditStart = () => {
    const { _id, title, img, link, content } = this.props
    const data = { _id, title, img, link, content, showDeleteConfirm: false, showLinkBar: false }
    this.props.postEditStart(data)
    this.setState({ showError: false })
  }

  handlePostClick = () => {
    if (this.props.showDeleteConfirm) { this.props.postShowDeleteConfirm(false) }
  }

  handleDelete = () => {
    this.props.postShowDeleteConfirm(!this.props.showDeleteConfirm)
    this.setState({ showError: false })
  }

  handleDeleteConfirm = () => {
    this.props.deletePostRequest(this.props._id)
  }

  handlePostContentChange = value => {
    const { content } = this.props
    const { locale } = this.state
    this.props.postContentChange({
      ...content,
      [locale]: value,
    })
    this.setState({ showError: false })
  }

  handlePostTitleChange = value => {
    const { title } = this.props
    const { locale } = this.state
    this.props.postTitleChange({
      ...title,
      [locale]: value,
    })
    this.setState({ showError: false })
  }

  handlePostRemoveContent = () => {
    const { content } = this.props
    const { locale } = this.state

    this.props.postContentChange({
      ...content,
      [locale]: '',
    })
    this.setState({ showError: false })
  }

  handleAddMedia = () => {
    this.mediaUploader.click()
  }

  handleFiles = evt => {
    getCroppedImage(evt.target.files[0], this.handleImage, 'landscape')
  }

  handleImage = (img, type) => {
    this.props.postImageChange(img)
    this.setState({ showError: false })
  }

  handlePostLanguageChange = evt => {
    this.setState({
      locale: evt.target.value,
      showError: false,
    })
  }

  handleSubmit = submitError => {
    if (submitError) {
      this.setState({ showError: true })
      return
    }
    this.setState({ showError: false })
    this.props.updatePostRequest()
  }

  render() {
    const {
      _id,
      title,
      img,
      content,
      firstname,
      created_at,
      editing,
      editable,
      showDeleteConfirm,
      info: { status, error },
      intl: { formatMessage },
      postEditEnd,
      updatePostRequest,
    } = this.props

    const { locale, showError } = this.state

    const defaultTexts = getDefaultTexts(locale, this.props.intl.locale)
    const spinnerShow = editing && (status === UPDATE_POST_REQUEST || status === DELETE_POST_REQUEST)
    const dropdownDisabled = !isLanguageSelectable(title, img, content, this.props.intl.locale)
    const { postType, remainCharCnts, submitError } = getSubmitInfo(title, img, content, this.props.intl.locale, locale, formatMessage)

    return (
      <div className="postContainer">
        { showDeleteConfirm && <div className="backLayer" onClick={this.handlePostClick} /> }
        <LoadingSpinner show={spinnerShow}>
          <QuarterSpinner width={30} height={30} />
        </LoadingSpinner>

        <div className="post textPost" onClick={this.handlePostClick}>
          { editing
            ? <Resizable className="postTitleEdit" tabIndex={1} placeholder={defaultTexts.title} onChange={this.handlePostTitleChange} value={title[locale]} />
            : <div className="postTitle" title={title[locale]} dangerouslySetInnerHTML={{ __html: title[locale] }} />
          }
          <div className="postContent">
            { editing && <RemoveButton type="content" onClick={this.handlePostRemoveContent} /> }
            <div className="postMeta">
              { firstname } - CARTA | {getTextFromDate(created_at, this.props.intl.locale)}
              { editable && !editing && <EditButton onClick={this.handleEditStart} /> }
            </div>
            { editing
              ? <Resizable className="postText" tabIndex={2} placeholder={defaultTexts.content} onChange={this.handlePostContentChange} value={content[locale]} />
              : <div className="postText" dangerouslySetInnerHTML={{ __html: content[locale] }} />
            }
          </div>
        </div>

        { editing &&
          <div className="postButtons">
            <div className="left">
              <input type="file" ref={ref => { this.mediaUploader = ref }} accept="image/*" onChange={this.handleFiles} />
              <span style={{ marginRight: '8px' }}>{ remainCharCnts >= 0 ? remainCharCnts : 0 }</span>
              <button type="button" className="postBorderBtn" onClick={this.handleAddMedia}>+ {formatMessage(messages.picture)}</button>
              <div className={cx({ postLang: true, disabled: dropdownDisabled })}>
                <select onChange={this.handlePostLanguageChange} disabled={dropdownDisabled} value={locale}>
                  { LANGUAGES.map(lang => <option key={lang.countryCode} value={lang.countryCode}>{lang.countryCode}</option>)}
                </select>
              </div>
            </div>
            <div className="right">
              <button type="button" className="postCancelBtn" onClick={postEditEnd}>{formatMessage(messages.cancel)}</button>
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

export default injectIntl(TextPost)
