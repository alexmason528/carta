import React, { PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import cx from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import messages from 'containers/HomePage/messages'
import Img from 'components/Img'

const CreatePostButton = ({ type, onClick, intl: { formatMessage } }) => (
  <button
    className={cx({
      createPostBtn: true,
      'createPostBtn--afterImage': type === 'image',
      'createPostBtn--afterText': type === 'text',
    })}
    onClick={onClick}
  >
    <div className="btnImage">
      <Img src={`${CLOUDINARY_ICON_URL}/add-post.png`} />
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
