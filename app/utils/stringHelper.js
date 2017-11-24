import messages from 'containers/HomePage/messages'

export const elemToText = elem =>
  elem !== null ?
  elem
  .replace(new RegExp('<div>', 'g'), '\n')
  .replace(new RegExp('</div>', 'g'), '')
  .replace(new RegExp('<br>', 'g'), '\n')
  .replace(new RegExp('&nbsp;', 'g'), ' ')
  : ''

export const textToElem = text => text ? text.replace(/\n/g, '<br />') : ''

export const getFirstname = fullname => fullname ? fullname.split(' ')[0] : ''

export const getPostLink = (editing, link, img) => {
  let postLink
  if (editing) {
    postLink = '#'
  } else if (link) {
    postLink = (link.indexOf('http:') !== -1 || link.indexOf('https:') !== -1) ? link : `http://${link}`
  } else {
    postLink = img
  }

  return postLink
}

export const getSubmitError = (img, title, content, formatMessage) => {
  let submitErrorTxt = ''
  const remainCharCnts = !content ? 1000 : 1000 - content.length

  if (!title) {
    submitErrorTxt = formatMessage(messages.requireTitle)
  } else if (!img && !content) {
    submitErrorTxt = formatMessage(messages.requireContent)
  } else if (remainCharCnts < 0) {
    submitErrorTxt = formatMessage(messages.limitExceeded)
  }

  return submitErrorTxt
}
