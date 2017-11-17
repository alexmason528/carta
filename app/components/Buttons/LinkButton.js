import React, { PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import messages from 'containers/HomePage/messages'

const LinkButton = ({ className, onClick, intl: { formatMessage } }) => (
  <button type="button" className={className} onClick={onClick}>
    <div className="btnImage">
      <img src={`${CLOUDINARY_ICON_URL}/link.png`} role="presentation" />
    </div>
    <div className="btnText">{formatMessage(messages.link)}</div>
  </button>
)

LinkButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  intl: intlShape.isRequired,
}

export default injectIntl(LinkButton)
