import React, { PropTypes } from 'react'
import cx from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import Img from 'components/Img'

const RemoveButton = ({ className, type, children, onClick }) => {
  const btnClass = cx({
    postRemoveImageBtn: type === 'image',
    postRemoveContentBtn: type === 'content',
    accountMenu__deleteButton: type === 'user',
    [className]: className,
  })

  let hover = type === 'image'
  let image

  if (type === 'image') {
    image = 'close-white-shadow'
  } else if (type === 'content') {
    image = 'close'
  } else if (type === 'user') {
    image = 'delete-red'
  }

  return (
    <button
      type="button"
      className={btnClass}
      onClick={onClick}
    >
      <Img src={`${CLOUDINARY_ICON_URL}/${image}.png`} />
      { hover && <Img className="hover" src={`${CLOUDINARY_ICON_URL}/${image}.png`} /> }
      { children }
    </button>
  )
}

RemoveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
}

export default RemoveButton
