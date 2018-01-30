import { isEqual } from 'lodash'

export const paramsChanged = (curProps, nextProps) => {
  if (curProps.viewport.zoom !== nextProps.viewport.zoom) {
    return true
  }

  if (!isEqual(curProps.viewport.center, nextProps.viewport.center)) {
    return true
  }

  if (curProps.types.all !== nextProps.types.all) {
    return true
  }

  if (!isEqual(curProps.types.includes, nextProps.types.includes)) {
    return true
  }

  if (!isEqual(curProps.types.excludes, nextProps.types.excludes)) {
    return true
  }

  if (curProps.descriptives.all !== nextProps.descriptives.all) {
    return true
  }

  if (!isEqual(curProps.descriptives.includes, nextProps.descriptives.includes)) {
    return true
  }

  if (!isEqual(curProps.descriptives.excludes, nextProps.descriptives.excludes)) {
    return true
  }

  if (!isEqual(curProps.descriptives.stars, nextProps.descriptives.stars)) {
    return true
  }

  return false
}
