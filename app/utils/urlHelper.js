/**
  Get current input type
  1: Integer
  0: Float
  -1: String
**/

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
    x: parseFloat(segs[0]),
    y: parseFloat(segs[1]),
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
      } else {
        return null
      }
    }
  } else {
    for (let seg of segs) {
      if (seg[0] === '+') {
        const desc = seg.slice(1)
        if (desc.length === 0 || getObjectType(desc) !== -1) return null
        descriptives.stars.push(desc)
      } else if (seg[0] === '-') {
        return null
      } else {
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
  return (str.charAt(0).toUpperCase() + str.slice(1)).replace('-', ' ')
}
