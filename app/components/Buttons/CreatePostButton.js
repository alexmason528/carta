import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import cx from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import messages from 'containers/HomePage/messages'

const CreatePostButton = ({ type, onClick, intl: { formatMessage } }) => (
  <button
    className={cx({ createPostBtn: true, 'createPostBtn--afterImage': type === 'image', 'createPostBtn--afterText': type === 'text' })}
    onClick={onClick}
  >
    <div className="btnImage">
      <img src={`${CLOUDINARY_ICON_URL}/add-post.png`} role="presentation" />
    </div>
    <div className="btnText">{formatMessage(messages.post)}</div>
  </button>
)

CreatePostButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string,
  intl: intlShape.isRequired,
}

export default injectIntl(CreatePostButton)
