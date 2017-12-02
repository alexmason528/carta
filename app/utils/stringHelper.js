import messages from 'containers/HomePage/messages'
import { LANGUAGES } from 'containers/LanguageProvider/constants'
import enTranslationMessages from 'translations/en.json'
import nlTranslationMessages from 'translations/nl.json'

const translations = {
  en: enTranslationMessages,
  nl: nlTranslationMessages,
}

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
  let error = ''
  const remainCharCnts = !content ? 1000 : 1000 - content.length

  if (!title) {
    error = formatMessage(messages.requireTitle)
  } else if (!img && !content) {
    error = formatMessage(messages.requireContent)
  } else if (remainCharCnts < 0) {
    error = formatMessage(messages.limitExceeded)
  }

  return error
}

export const getPostType = (img, content) => {
  let postType

  if (img && content !== null) {
    postType = 'mixedPost'
  } else if (img && content === null) {
    postType = 'mediaPost'
  } else if (!img && content !== null) {
    postType = 'textPost'
  }

  return postType
}

export const isLanguageSelectable = (title, img, content, defaultLocale) => {
  const postType = getPostType(img, content)

  for (let lang of LANGUAGES) {
    const { countryCode } = lang
    if ((countryCode !== defaultLocale) && ((title && title[countryCode].length > 0) || (content && content[countryCode].length > 0))) return true
  }

  if (postType === 'mediaPost') {
    return title[defaultLocale].length > 0
  } else if (postType === 'textPost' || postType === 'mixedPost') {
    return (title[defaultLocale].length > 0 && content[defaultLocale].length > 0)
  }
}

export const getDefaultTexts = (locale = 'en', defaultLocale) => {
  let title = translations[locale]['carta.title']
  let content = `${translations[locale]['carta.text']}...`

  if (locale !== defaultLocale) {
    for (let lang of LANGUAGES) {
      const { countryCode, third } = lang
      if (countryCode === locale) {
        title = `${third} ${title}`
        content = `${third} ${content}`
        break
      }
    }
  }

  return { title, content }
}

export const getSubmitInfo = (title, img, content, defaultLocale, curLocale, formatMessage) => {
  let submitError
  const postType = getPostType(img, content)
  const remainCharCnts = !content ? 1000 : 1000 - content[curLocale].length

  if (postType === 'mediaPost') {
    let hasOtherTitle = false
    for (let lang of LANGUAGES) {
      const { countryCode } = lang
      if (countryCode !== defaultLocale && title[countryCode] !== '') {
        hasOtherTitle = true
        break
      }
    }

    if (title[defaultLocale] === '') {
      submitError = hasOtherTitle ? formatMessage(messages.requireTitle, { lang: defaultLocale.toUpperCase() }) : formatMessage(messages.requireDefaultTitle)
    }
  } else if (postType === 'textPost' || postType === 'mixedPost') {
    let hasOtherTitle = false
    let hasOtherContent = false

    for (let lang of LANGUAGES) {
      const { countryCode } = lang
      if (countryCode !== defaultLocale && title[countryCode] !== '') {
        hasOtherTitle = true
        break
      }
    }

    for (let lang of LANGUAGES) {
      const { countryCode } = lang
      if (countryCode !== defaultLocale && content[countryCode] !== '') {
        hasOtherContent = true
        break
      }
    }

    if (title[defaultLocale] === '') {
      submitError = hasOtherTitle ? formatMessage(messages.requireTitle, { lang: defaultLocale.toUpperCase() }) : formatMessage(messages.requireDefaultTitle)
    } else if (content[defaultLocale] === '') {
      submitError = hasOtherContent ? formatMessage(messages.requireContent, { lang: defaultLocale.toUpperCase() }) : formatMessage(messages.requireDefaultContent)
    } else {
      for (let lang of LANGUAGES) {
        const { countryCode } = lang
        if (title[countryCode] === '' && content[countryCode] !== '') {
          submitError = formatMessage(messages.requireTitle, { lang: countryCode.toUpperCase() })
        } else if (title[countryCode] !== '' && content[countryCode] === '') {
          submitError = formatMessage(messages.requireContent, { lang: countryCode.toUpperCase() })
        }
        if (submitError) break
      }
    }
  }

  return { postType, remainCharCnts, submitError }
}
