/**
  Get current input type
  1: Integer
  0: Float
  -1: String
**/

import { map, join } from 'lodash'

const getObjectType = input => {
  if (input[0] === '.') return -1
  if (input.indexOf('e') !== -1) return -1
  if (isNaN(input)) return -1
  if ((parseFloat(input) === parseInt(input, 10)) && input === parseInt(input, 10).toString()) return 1
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
    center: {
      x: parseFloat(segs[0]),
      y: parseFloat(segs[1]),
    },
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

  if (segs[0] === 'anything') {
    types.all = true
    segs.splice(0, 1)
  }

  for (let seg of segs) {
    if (getObjectType(seg) !== -1) return null
    if (types.all) {
      types.excludes.push(seg)
    } else {
      types.includes.push(seg)
    }
  }

  return types
}

const getDescriptives = desStr => {
  let segs = desStr.split(',')

  let descriptives = {
    all: false,
    stars: [],
    includes: [],
    excludes: [],
  }

  if (segs[0] === 'anything') {
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

export const urlParser = (viewportStr, typesStr, descriptivesStr) => {
  const viewport = getViewport(viewportStr)
  const types = getTypes(typesStr)
  const descriptives = getDescriptives(descriptivesStr)

  if (viewport && types && descriptives) {
    return {
      viewport,
      types,
      descriptives,
    }
  } else {
    return null
  }
}

export const getQuestStr = str => {
  return (str.charAt(0).toUpperCase() + str.slice(1)).replace(/-/g, ' ')
}

export const getUrlStr = str => {
  return (str.charAt(0).toLowerCase() + str.slice(1)).replace(/ /g, '-')
}

export const composeUrl = (viewport, types, descriptives) => {
  const { zoom, northeast, southwest, x, y } = viewport
  let viewportStr
  if (northeast && southwest) {
    viewportStr = `${((northeast.x + southwest.x) / 2).toFixed(2)},${((northeast.y + southwest.y) / 2).toFixed(2)},${zoom}`
  } else {
    viewportStr = `${x},${y},${zoom.toFixed(2)}`
  }

  let typeStr = ''
  let descStr = ''

  const typeAll = types.all ? 'anything' : undefined
  const typeIncludes = types.includes.length > 0 ? types.includes.map(type => getUrlStr(type.en)).join(',') : undefined
  const typeExcludes = types.excludes.length > 0 ? types.excludes.map(type => getUrlStr(type.en)).join(',') : undefined

  const descAll = descriptives.all ? 'anything' : undefined
  const descStars = descriptives.stars.length > 0 ? descriptives.stars.map(type => `+${getUrlStr(type.en)}`).join(',') : undefined
  const descIncludes = descriptives.includes.length > 0 ? descriptives.includes.map(type => getUrlStr(type.en)).join(',') : undefined
  const descExcludes = descriptives.excludes.length > 0 ? descriptives.excludes.map(type => `-${getUrlStr(type.en)}`).join(',') : undefined

  if (types.all) {
    let arr = [typeAll]
    if (typeExcludes) arr.push(typeExcludes)
    typeStr = arr.join(',')
  } else {
    typeStr = typeIncludes || ''
  }

  if (descriptives.all) {
    let arr = [descAll]

    if (descStars) arr.push(descStars)
    if (descExcludes) arr.push(descExcludes)
    descStr = arr.join(',')
  } else {
    let arr = []
    if (descStars) arr.push(descStars)
    if (descIncludes) arr.push(descIncludes)
    descStr = arr.join(',')
  }

  const url = `${viewportStr}/${typeStr}/${descStr}`
  const sendRequest = (viewportStr !== '' && typeStr !== '' && descStr !== '')

  return {
    viewport: viewportStr,
    types: typeStr,
    descriptives: descStr,
    url: `/quest/q/${viewportStr}/${typeStr}/${descStr}`,
    sendRequest,
  }
}
