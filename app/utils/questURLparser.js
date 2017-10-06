/**
  Get current input type
  1: Integer
  0: Float
  -1: String
**/

function getType(input) {
  if (input[0] === '.') return -1
  if (input.indexOf('e') !== -1) return -1
  if (isNaN(input)) return -1
  if ((parseFloat(input) === parseInt(input, 10)) && input === parseInt(input, 10).toString()) return 1
  return 0
}

export default function parseURL({ viewport, types, descriptives }) {
  const viewportSegs = viewport.split(',')

  if (viewportSegs.length !== 3) {
    return { error: true, data: null }
  }

  for (let seg of viewportSegs) {
    if (getType(seg) === -1) return { error: true, data: null }
  }

  const viewportData = {
    x: parseFloat(viewportSegs[0]),
    y: parseFloat(viewportSegs[1]),
    zoom: parseFloat(viewportSegs[2]),
  }

  let typeSegs = types.split(',')

  let typesData = {
    anything: 0,
    interests: [],
  }

  if (typeSegs[0] === 'a') {
    typesData.anything = 1
    typeSegs.splice(0, 1)
  }

  for (let seg of typeSegs) {
    if (getType(seg) !== 1) return { error: true, data: null }
    typesData.interests.push(`c${seg}`)
  }

  let descriptiveSegs = descriptives.split(',')

  let descriptivesData = {
    anything: 0,
    interests: [],
    stars: [],
  }

  if (descriptiveSegs[0] === 'a') {
    descriptivesData.anything = 1
    descriptiveSegs.splice(0, 1)
  }

  for (let seg of descriptiveSegs) {
    let star = false
    if (seg.indexOf('s') !== -1) {
      star = true
      seg = seg.replace('s', '')
    }

    if (getType(seg) !== 1) return { error: true, data: null }

    if (star) {
      descriptivesData.stars.push(`c${seg}`)
    } else {
      descriptivesData.interests.push(`c${seg}`)
    }
  }

  return {
    error: false,
    data: {
      viewport: viewportData,
      types: typesData,
      descriptives: descriptivesData,
    },
  }
}
