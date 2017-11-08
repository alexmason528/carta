export const elemToText = elem =>
  elem !== null ?
  elem
  .replace(new RegExp('<div>', 'g'), '\n')
  .replace(new RegExp('</div>', 'g'), '')
  .replace(new RegExp('<br>', 'g'), '\n')
  .replace(new RegExp('&nbsp;', 'g'), ' ')
  : ''
export const textToElem = text => text ? text.replace(/\n/g, '<br />') : ''

export const getPostType = (img, content) => {
  if (img && content !== null) {
    return 'mixedPost'
  } else if (img && content === null) {
    return 'mediaPost'
  } else if (!img && content !== null) {
    return 'textPost'
  }
}
