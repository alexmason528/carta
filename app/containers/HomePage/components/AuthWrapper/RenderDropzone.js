import React, { Component, PropTypes } from 'react'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import Dropzone from 'react-dropzone'
import { getCroppedImage } from 'utils/imageHelper'

class RenderDropZone extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    input: PropTypes.object,
    meta: PropTypes.object,
    name: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    crop: PropTypes.string,
  }

  handleDrop = (filesToUpload, e) => {
    const img = filesToUpload[0]
    const { crop } = this.props

    if (!crop) {
      input.onChange(img)
    } else {
      getCroppedImage(img, this.handleImage, crop)
    }
  }

  handleImage = (img, type) => {
    const { input } = this.props
    input.onChange(img)
  }

  render() {
    const { input, className, label, meta: { touched, error, warning } } = this.props
    const files = input.value
    const name = input.name

    return (
      <div>
        <Dropzone
          className={className}
          name={name}
          onDrop={this.handleDrop}
          accept="image/*"
          multiple={false}
        >
          <div>{label}</div>
          { files.length > 0 && <img className="img13" src={`${CLOUDINARY_ICON_URL}/check-green.png`} role="presentation" /> }
        </Dropzone>
        { touched && error && <span className="error">{error}</span> }
      </div>
    )
  }
}

export default RenderDropZone
