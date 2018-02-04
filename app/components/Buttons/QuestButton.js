import React, { PropTypes } from 'react'
import cx from 'classnames'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'

const QuestButton = ({ panelState, onClick, onCloseClick }) => (
  <div className={cx({ questBtn: true, questBtn__opened: panelState === 'minimized', questBtn__closed: panelState !== 'minimized' })}>
    <div onClick={onClick}>
      <Img src={`${S3_ICON_URL}/search.png`} className="inactive" />
      <Img src={`${S3_ICON_URL}/search-blue.png`} className="active" />
    </div>
    <span onClick={onCloseClick}>
      <Img src={`${S3_ICON_URL}/close.png`} />
    </span>
  </div>
)

QuestButton.propTypes = {
  onClick: PropTypes.func,
  onCloseClick: PropTypes.func,
  panelState: PropTypes.string,
}

export default QuestButton
