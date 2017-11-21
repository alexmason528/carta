import axios from 'axios'
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from 'containers/App/constants'

const getImagePortion = (imgObj, type) => {
  let tnCanvas = document.createElement('canvas')
  let tnCanvasContext = tnCanvas.getContext('2d')

  let bufferCanvas = document.createElement('canvas')
  let bufferContext = bufferCanvas.getContext('2d')

  const width = imgObj.width
  const height = imgObj.height

  if (type === 'landscape') {
    if (width >= height) {
      tnCanvas.width = width
      tnCanvas.height = height
      bufferCanvas.width = width
      bufferCanvas.height = height
      bufferContext.drawImage(imgObj, 0, 0)
      tnCanvasContext.drawImage(bufferCanvas, 0, 0, width, height, 0, 0, width, height)
    } else {
      tnCanvas.width = width
      tnCanvas.height = width
      bufferCanvas.width = width
      bufferCanvas.height = height
      bufferContext.drawImage(imgObj, 0, 0)
      tnCanvasContext.drawImage(bufferCanvas, 0, (height - width) / 2, width, width, 0, 0, width, width)
    }
  } else if (type === 'portrait') {
    if (height >= width) {
      tnCanvas.width = width
      tnCanvas.height = height
      bufferCanvas.width = width
      bufferCanvas.height = height
      bufferContext.drawImage(imgObj, 0, 0)
      tnCanvasContext.drawImage(bufferCanvas, 0, 0, width, height, 0, 0, width, height)
    } else {
      tnCanvas.width = height
      tnCanvas.height = height
      bufferCanvas.width = width
      bufferCanvas.height = height
      bufferContext.drawImage(imgObj, 0, 0)
      tnCanvasContext.drawImage(bufferCanvas, (width - height) / 2, 0, height, height, 0, 0, height, height)
    }
  }

  return tnCanvas.toDataURL('image/jpeg', 0.5)
}

export const getCroppedImage = (file, handler, type) => {
  const _URL = window.URL || window.webkitURL
  let img = new Image()
  img.src = _URL.createObjectURL(file)

  img.onload = () => {
    handler(getImagePortion(img, type), type)
  }
}

export const uploadImage = (img, successCallback, failCallback) => {
  let formData = new FormData()
  formData.append('file', img)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  axios.post(CLOUDINARY_UPLOAD_URL, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then(successCallback).catch(failCallback)
}
