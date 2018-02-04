/**
  Get current input type
  1: Integer
  0: Float
  -1: String
**/

import { pullAt } from 'lodash'
import { DEFAULT_LOCALE } from 'containers/LanguageProvider/constants'
import enTranslationMessages from 'translations/en.json'
import nlTranslationMessages from 'translations/nl.json'
import { getItem } from './localStorage'
import { MAX_ZOOM } from './globalConstants'

const translations = {
  en: enTranslationMessages,
  nl: nlTranslationMessages,
}

export const getObjectType = input => {
  if (input[0] === '.') return -1
  if (isNaN(input)) return -1
  if (parseFloat(input) === parseInt(input, 10) && input === parseInt(input, 10).toString()) {
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
    center: { lng: parseFloat(segs[0]), lat: parseFloat(segs[1]) },
    zoom: parseFloat(segs[2] > MAX_ZOOM ? MAX_ZOOM : segs[2]),
  }
}

const getTypes = typesStr => {
  let types = {
    all: false,
    expanded: false,
    includes: [],
    excludes: [],
    visibles: [],
  }

  if (!typesStr) return types
  let segs = typesStr.split(',')

  if (segs[0].toLowerCase() === translations[DEFAULT_LOCALE]['carta.anything'].toLowerCase()) {
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
  let descriptives = {
    all: false,
    expanded: false,
    stars: [],
    includes: [],
    excludes: [],
    visibles: [],
  }

  if (!desStr) return descriptives

  let segs = desStr.split(',')

  if (segs[0].toLowerCase() === translations[DEFAULT_LOCALE]['carta.anything'].toLowerCase()) {
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

const viewportChanged = (params, value) => {
  params.viewport = value
  return params
}

const typeChanged = (params, value) => {
  let types = params.types ? params.types.split(',') : []
  const isAnything = types.length && types[0] === 'anything'

  if (value === 'anything') {
    params.types = isAnything ? '' : 'anything'
    return params
  }

  if (isAnything) {
    const ind = types.indexOf(`-${value}`)
    if (ind === -1) {
      types.push(`-${value}`)
    } else {
      pullAt(types, ind)
    }
  } else {
    const ind = types.indexOf(value)
    if (ind === -1) {
      types.push(value)
    } else {
      pullAt(types, ind)
    }
  }

  params.types = types.join(',')
  return params
}

const descChanged = (params, value, star) => {
  let descriptives = params.descriptives && params.descriptives !== 'popular' ? params.descriptives.split(',') : []
  const isAnything = descriptives.length && descriptives[0] === 'anything'

  if (value === 'anything') {
    if (isAnything) {
      params.descriptives = ''
    } else {
      descriptives = descriptives.filter(desc => desc[0] === '+')
      params.descriptives = ['anything', ...descriptives].join(',')
    }
    return params
  }

  if (isAnything) {
    if (star) {
      const starInd = descriptives.indexOf(`+${value}`)
      if (starInd === -1) {
        descriptives.push(`+${value}`)
      } else {
        pullAt(descriptives, starInd)
      }
    } else {
      const starInd = descriptives.indexOf(`+${value}`)
      const excludeInd = descriptives.indexOf(`-${value}`)
      const ind = descriptives.indexOf(value)

      if (excludeInd !== -1) {
        pullAt(descriptives, excludeInd)
      } else {
        pullAt(descriptives, starInd)
        pullAt(descriptives, ind)
        descriptives.push(`-${value}`)
      }
    }
  } else if (star) {
    const starInd = descriptives.indexOf(`+${value}`)
    if (starInd === -1) {
      const ind = descriptives.indexOf(value)
      descriptives[ind] = `+${value}`
    } else {
      descriptives[starInd] = value
    }
  } else {
    const starInd = descriptives.indexOf(`+${value}`)

    if (starInd === -1) {
      const ind = descriptives.indexOf(value)
      if (ind === -1) {
        descriptives.push(value)
      } else {
        pullAt(descriptives, ind)
      }
    } else {
      pullAt(descriptives, starInd)
    }
  }

  params.descriptives = descriptives.join(',')
  return params
}

const buildUrl = params => {
  if (!params.types) {
    return `/quest/${params.viewport}`
  }

  return `/quest/${params.viewport}/${params.types}/${params.descriptives || 'popular'}`
}

export const urlComposer = ({ params, change, value, star }) => {
  let url

  switch (change) {
    case 'viewport':
      url = buildUrl(viewportChanged(params, value))
      break

    case 'types':
      url = buildUrl(typeChanged(params, value))
      break

    case 'descriptives':
      url = buildUrl(descChanged(params, value, star))
      break

    default:
      url = buildUrl(params)
  }
  return url
}

export const canSendRequest = ({ types }) => {
  return types.includes.length > 0
}

export const getQuestUrl = () => {
  const quests = JSON.parse(getItem('quests'))
  const ind = JSON.parse(getItem('curQuestInd'))
  const viewport = JSON.parse(getItem('viewport'))
  const quest = quests[ind]

  let params = ['/quest', viewport]

  if (quest.types) params.push(quest.types)
  if (quest.descriptives) params.push(quest.descriptives)

  return params.join('/')
}

export const checkQuest = () => {
  const quests = JSON.parse(getItem('quests'))
  const ind = JSON.parse(getItem('curQuestInd'))
  const quest = quests[ind]

  return { url: getQuestUrl(), continueQuest: quests.length > 1 || !!quest.types }
}
