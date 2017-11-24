import React, { PropTypes, Children } from 'react'
import classNames from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import Img from 'components/Img'

const QuestButton = ({ className, onClick, onCloseClick }) => (
  <div className={className}>
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
  className: PropTypes.string,
  onClick: PropTypes.func,
  onCloseClick: PropTypes.func,
}

export default QuestButton
