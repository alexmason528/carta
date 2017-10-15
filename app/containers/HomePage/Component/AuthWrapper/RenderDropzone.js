import React, { PropTypes } from 'react'
import Dropzone from 'react-dropzone'

const RenderDropZone = ({ input, name, className, label, meta: { touched, error, warning } }) => {
  const files = input.value

  return (
    <div>
      <Dropzone
        className={className}
        name={name}
        onDrop={(filesToUpload, e) => input.onChange(filesToUpload)}
        accept="image/*"
        multiple={false}
      >
        <div>{label}</div>
        { files.length > 0 && <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/check-green.png" role="presentation" />}
      </Dropzone>
      {touched && error && <span className="error">{error}</span>}
    </div>
  )
}

RenderDropZone.propTypes = {
  input: PropTypes.object,
  name: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  meta: PropTypes.object,
}

export default RenderDropZone
