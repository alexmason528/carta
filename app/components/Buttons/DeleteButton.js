import React, { PropTypes } from 'react'
import cx from 'classnames'
import { injectIntl, intlShape } from 'react-intl'
import messages from 'containers/HomePage/messages'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'

const DeleteButton = props => {
  const { showConfirm, onClick, onConfirm, className, intl: { formatMessage } } = props
  return (
    <div className={cx({ postDeleteBtn: true, [className]: className })} onClick={onClick}>
      <Img src={`${S3_ICON_URL}/delete.png`} />
      <div className="popOver" style={{ display: showConfirm ? 'block' : 'none' }}>
        <button type="button" onClick={onConfirm}>
          {formatMessage(messages.sure)}
        </button>
      </div>
    </div>
  )
}

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  className: PropTypes.string,
  showConfirm: PropTypes.bool,
  intl: intlShape.isRequired,
}

export default injectIntl(DeleteButton)
