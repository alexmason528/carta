import React, { PropTypes, Children } from 'react'
import cx from 'classnames'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'

const StarButton = ({ star, active, className, children, onStarClick, onMouseDown }) => (
  <div className={cx({ section__btn: true, star, active, [className]: className })}>
    <button onMouseDown={onMouseDown}>{Children.toArray(children)}</button>
    <Img src={`${S3_ICON_URL}/star-green.png`} onClick={onStarClick} />
  </div>
)

StarButton.propTypes = {
  onMouseDown: PropTypes.func,
  onStarClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  star: PropTypes.bool,
  className: PropTypes.string,
}

export default StarButton
