/**
  Get current input type
  1: Integer
  0: Float
  -1: String
**/

import { DEFAULT_LOCALE } from 'containers/LanguageProvider/constants'
import enTranslationMessages from 'translations/en.json'
import nlTranslationMessages from 'translations/nl.json'
import { getItem } from './localStorage'

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
  const segs = viewportStr.split(',')

  if (segs.length !== 3) {
    return null
  }

  for (let seg of segs) {
    if (getObjectType(seg) === -1) return null
  }

  return {
    center: { lng: parseFloat(segs[0]), lat: parseFloat(segs[1]) },
    zoom: parseFloat(segs[2]),
  }
}

const getTypes = typesStr => {
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
  if (!desStr) return 'popular'

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

export const urlParser = ({ viewport, types, descriptives, brochure }) => {
  if (!viewport || !types) {
    const storageViewport = getItem('viewport')
    const storageQuests = getItem('quests')
    const storageInd = getItem('curQuestInd')

    if (!storageViewport || !storageQuests || brochure) {
      return {
        viewport: undefined,
        types: undefined,
        descriptives: 'popular',
        brochure,
      }
    }

    const viewport = JSON.parse(storageViewport)
    const ind = storageInd || 0
    const quest = JSON.parse(storageQuests)[ind]
    const types = {
      ...quest.types,
      includes: quest.types.includes.map(type =>
        getUrlStr(type[DEFAULT_LOCALE])
      ),
      excludes: quest.types.excludes.map(type =>
        getUrlStr(type[DEFAULT_LOCALE])
      ),
      visibles: quest.types.visibles.map(type =>
        getUrlStr(type[DEFAULT_LOCALE])
      ),
    }

    const descriptives = {
      ...quest.descriptives,
      stars: quest.descriptives.includes.map(desc =>
        getUrlStr(desc[DEFAULT_LOCALE])
      ),
      includes: quest.descriptives.includes.map(desc =>
        getUrlStr(desc[DEFAULT_LOCALE])
      ),
      excludes: quest.descriptives.excludes.map(desc =>
        getUrlStr(desc[DEFAULT_LOCALE])
      ),
      visibles: quest.descriptives.visibles.map(desc =>
        getUrlStr(desc[DEFAULT_LOCALE])
      ),
    }

    return {
      viewport,
      types,
      descriptives,
      brochure,
    }
  }
  const resViewport = getViewport(viewport)
  const resTypes = getTypes(types)
  const resDescriptives = getDescriptives(descriptives)

  return {
    viewport: resViewport,
    types: resTypes,
    descriptives: resDescriptives,
    brochure,
  }
}

export const getQuestStr = str => {
  return (str.charAt(0).toUpperCase() + str.slice(1)).replace(/-/g, ' ')
}

export const getUrlStr = str => {
  return (str.charAt(0).toLowerCase() + str.slice(1)).replace(/ /g, '-')
}

export const urlComposer = ({ brochure, viewport, types, descriptives }) => {
  let viewportParam = viewport
    ? `${viewport.center.lng},${viewport.center.lat},${viewport.zoom}`
    : undefined
  let typeParam
  let descParam

  if (types) {
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
    if (types.all) {
      let arr = [typeAll]
      if (typeExcludes) arr.push(typeExcludes)
      typeParam = arr.join(',')
    } else {
      typeParam = typeIncludes || ''
    }
  }
  if (descriptives && descriptives !== 'popular') {
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
  }

  let params = ['/quest']
  if (brochure) {
    params.push(`in/${brochure}`)
  }

  if (viewportParam && typeParam) {
    params.push(viewportParam)
    params.push(typeParam)
    params.push(descParam || 'popular')
  }

  const url = params.join('/')
  return url
}

export const canSendRequest = ({ types }) => {
  return types.all || types.includes.length > 0
}

export const checkQuest = () => {
  const storageViewport = getItem('viewport')
  const storageQuests = getItem('quests')
  const storageInd = getItem('curQuestInd')

  if (!storageViewport || !storageQuests) {
    return false
  }

  const ind = storageInd || 0
  const quests = JSON.parse(storageQuests)
  const { types } = quests[ind]

  if (quests.length > 1) {
    return true
  }

  return canSendRequest({ types })
}
