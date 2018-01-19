import React, { PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import cx from 'classnames'
import messages from 'containers/HomePage/messages'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'

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
      <Img src={`${S3_ICON_URL}/add-post.png`} />
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
