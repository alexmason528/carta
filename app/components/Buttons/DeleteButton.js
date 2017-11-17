import React, { PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import messages from 'containers/HomePage/messages'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

const DeleteButton = ({ className, showConfirm, onClick, onConfirm, intl: { formatMessage } }) => (
  <div className={className} onClick={onClick}>
    <img src={`${CLOUDINARY_ICON_URL}/delete.png`} role="presentation" />
    <div className="popOver" style={{ display: showConfirm ? 'block' : 'none' }}>
      <button type="button" onClick={onConfirm}>{formatMessage(messages.sure)}</button>
    </div>
  </div>
)

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  className: PropTypes.string,
  showConfirm: PropTypes.bool,
  intl: intlShape.isRequired,
}

export default injectIntl(DeleteButton)
