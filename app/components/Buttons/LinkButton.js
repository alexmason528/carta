import React, { PropTypes } from 'react'
import cx from 'classnames'
import { injectIntl, intlShape } from 'react-intl'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import messages from 'containers/HomePage/messages'
import Img from 'components/Img'

const LinkButton = ({ onClick, className, intl: { formatMessage } }) => (
  <button type="button" className={cx({ postLinkBtn: true, [className]: className })} onClick={onClick}>
    <div className="btnImage">
      <Img src={`${CLOUDINARY_ICON_URL}/link.png`} />
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
