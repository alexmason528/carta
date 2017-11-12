import React, { PropTypes, Children } from 'react'
import classNames from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

const QuestButton = ({ className, onClick, onCloseClick }) => (
  <div className={className}>
    <div onClick={onClick}>
      <img src={`${CLOUDINARY_ICON_URL}/search.png`} className="inactive" role="presentation" />
      <img src={`${CLOUDINARY_ICON_URL}/search-blue.png`} className="active" role="presentation" />
    </div>
    <span onClick={onCloseClick}>
      <img src={`${CLOUDINARY_ICON_URL}/close.png`} role="presentation" />
    </span>
  </div>
)

QuestButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  onCloseClick: PropTypes.func,
}

export default QuestButton
