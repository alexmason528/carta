/**
  Get current input type
  1: Integer
  0: Float
  -1: String
**/

import { DEFAULT_LOCALE } from 'containers/LanguageProvider/constants'
import enTranslationMessages from 'translations/en.json'
import nlTranslationMessages from 'translations/nl.json'

const translations = {
  en: enTranslationMessages,
  nl: nlTranslationMessages,
}

export const getObjectType = input => {
  if (input[0] === '.') return -1
  if (isNaN(input)) return -1
  if (
    parseFloat(input) === parseInt(input, 10) &&
    input === parseInt(input, 10).toString()
  ) {
    return 1
  }
  return 0
}

const getViewport = viewportStr => {
  if (!viewportStr) return undefined

  const segs = viewportStr.split(',')

  if (segs.length !== 3) {
    return null
  }

  for (let seg of segs) {
    if (getObjectType(seg) === -1) return null
  }

  return {
    center: [parseFloat(segs[0]), parseFloat(segs[1])],
    zoom: parseFloat(segs[2]),
  }
}

const getTypes = typesStr => {
  if (!typesStr) return undefined

  let segs = typesStr.split(',')

  let types = {
    all: false,
    includes: [],
    excludes: [],
  }

  if (
    segs[0].toLowerCase() ===
    translations[DEFAULT_LOCALE]['carta.anything'].toLowerCase()
  ) {
    types.all = true
    segs.splice(0, 1)
  }

  if (types.all) {
    for (let seg of segs) {
      if (getObjectType(seg) !== -1 || seg[0] !== '-') return null
      types.excludes.push(seg.slice(1))
    }
  } else {
    for (let seg of segs) {
      if (getObjectType(seg) !== -1 || seg[0] === '-') return null
      types.includes.push(seg)
    }
  }

  return types
}

const getDescriptives = desStr => {
  if (!desStr) return undefined

  let segs = desStr.split(',')

  let descriptives = {
    all: false,
    stars: [],
    includes: [],
    excludes: [],
  }

  if (
    segs[0].toLowerCase() ===
    translations[DEFAULT_LOCALE]['carta.anything'].toLowerCase()
  ) {
    descriptives.all = true
    segs.splice(0, 1)
  }

  if (descriptives.all) {
    for (let seg of segs) {
      if (seg.length <= 2) return null
      const sign = seg[0]
      const desc = seg.slice(1)
      if (getObjectType(desc) !== -1) return null
      if (sign === '+') {
        descriptives.stars.push(desc)
      } else if (sign === '-') {
        descriptives.excludes.push(desc)
      }
    }
  } else {
    for (let seg of segs) {
      if (seg[0] === '+') {
        const desc = seg.slice(1)
        if (desc.length === 0 || getObjectType(desc) !== -1) return null
        descriptives.stars.push(desc)
      } else if (seg[0] !== '-') {
        const desc = seg
        if (getObjectType(desc) !== -1) return null
        descriptives.includes.push(desc)
      }
    }
  }

  return descriptives
}

export const urlParser = ({ viewport, types, descriptives }) => {
  const resViewport = getViewport(viewport)
  const resTypes = getTypes(types)
  const resDescriptives = getDescriptives(descriptives)

  return {
    viewport: resViewport,
    types: resTypes,
    descriptives: resDescriptives,
  }
}

export const getQuestStr = str => {
  return (str.charAt(0).toUpperCase() + str.slice(1)).replace(/-/g, ' ')
}

export const getUrlStr = str => {
  return (str.charAt(0).toLowerCase() + str.slice(1)).replace(/ /g, '-')
}

export const urlComposer = ({ viewport, types, descriptives, brochure }) => {
  const { zoom, center } = viewport
  let viewportParam = `${center[0]},${center[1]},${zoom}`

  let typeParam = ''
  let descParam = ''

  const typeAll = types.all
    ? translations[DEFAULT_LOCALE]['carta.anything'].toLowerCase()
    : undefined
  const typeIncludes =
    types.includes.length > 0
      ? types.includes.map(type => getUrlStr(type[DEFAULT_LOCALE])).join(',')
      : undefined
  const typeExcludes =
    types.excludes.length > 0
      ? types.excludes
          .map(type => `-${getUrlStr(type[DEFAULT_LOCALE])}`)
          .join(',')
      : undefined

  const descAll = descriptives.all
    ? translations[DEFAULT_LOCALE]['carta.anything'].toLowerCase()
    : undefined
  const descStars =
    descriptives.stars.length > 0
      ? descriptives.stars
          .map(type => `+${getUrlStr(type[DEFAULT_LOCALE])}`)
          .join(',')
      : undefined
  const descIncludes =
    descriptives.includes.length > 0
      ? descriptives.includes
          .map(type => getUrlStr(type[DEFAULT_LOCALE]))
          .join(',')
      : undefined
  const descExcludes =
    descriptives.excludes.length > 0
      ? descriptives.excludes
          .map(type => `-${getUrlStr(type[DEFAULT_LOCALE])}`)
          .join(',')
      : undefined

  if (types.all) {
    let arr = [typeAll]
    if (typeExcludes) arr.push(typeExcludes)
    typeParam = arr.join(',')
  } else {
    typeParam = typeIncludes || ''
  }

  if (descriptives.all) {
    let arr = [descAll]

    if (descStars) arr.push(descStars)
    if (descExcludes) arr.push(descExcludes)
    descParam = arr.join(',')
  } else {
    let arr = []
    if (descStars) arr.push(descStars)
    if (descIncludes) arr.push(descIncludes)
    descParam = arr.join(',')
  }

  let params = ['/quest']

  if (typeParam) {
    params.push(viewportParam)
    params.push(typeParam)
    if (descParam) {
      params.push(descParam)
    }
  }

  if (brochure) {
    params.push(`info/${brochure}`)
  }

  const url = params.join('/')
  return url
}

export const canSendRequest = ({ types }) => {
  return types.all || types.includes.length > 0
}
