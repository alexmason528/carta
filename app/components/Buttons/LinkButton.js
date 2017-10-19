import React, { PropTypes } from 'react'

const LinkButton = ({ className, onClick }) => (
  <button type="button" className={className} onClick={onClick}>
    <div className="btnImage">
      <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/add-post.png" role="presentation" />
    </div>
    <div className="btnText">Link</div>
  </button>
)

LinkButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default LinkButton
