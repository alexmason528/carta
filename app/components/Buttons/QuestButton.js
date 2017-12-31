import React, { PropTypes } from 'react'
import cx from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import Img from 'components/Img'

const QuestButton = ({ panelState, onClick, onCloseClick }) => (
  <div
    className={cx({
      questBtn: true,
      questBtn__opened: panelState === 'minimized',
      questBtn__closed: panelState !== 'minimized',
    })}
  >
    <div onClick={onClick}>
      <Img src={`${CLOUDINARY_ICON_URL}/search.png`} className="inactive" />
      <Img src={`${CLOUDINARY_ICON_URL}/search-blue.png`} className="active" />
    </div>
    <span onClick={onCloseClick}>
      <Img src={`${CLOUDINARY_ICON_URL}/close.png`} />
    </span>
  </div>
)

QuestButton.propTypes = {
  onClick: PropTypes.func,
  onCloseClick: PropTypes.func,
  panelState: PropTypes.string,
}

export default QuestButton
