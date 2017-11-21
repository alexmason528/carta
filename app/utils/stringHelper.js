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
