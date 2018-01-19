import AWS from 'aws-sdk'
import { S3_BUCKET_NAME, S3_BUCKET_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_KEY, AWS_REGION } from './globalConstants'

AWS.config.accessKeyId = AWS_ACCESS_KEY_ID
AWS.config.secretAccessKey = AWS_SECRET_KEY
AWS.config.region = AWS_REGION

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

export const getS3Key = path => {
  const timestamp = new Date().getTime()
  const rand = Math.floor(Math.random() * 1000000 + 1)
  return `${path}/${timestamp}_${rand}.jpeg`
}

export const imageUploader = (path, pic, handler) => {
  const s3Bucket = new AWS.S3({ params: { Bucket: S3_BUCKET_NAME } })
  const picBuffer = new Buffer(pic.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const key = getS3Key(path)
  const s3Data = {
    Key: key,
    Body: picBuffer,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  }
  s3Bucket.putObject(s3Data, err => {
    const url = `${S3_BUCKET_URL}/${key}`
    handler(err, url)
  })
}
