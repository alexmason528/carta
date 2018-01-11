import 'whatwg-fetch'
import { pick } from 'lodash'
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json()
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.ok) {
    return response
  }

  const err = pick(response, ['status', 'statusText'])

  return response.json().then(
    json => {
      throw Object.assign(err, pick(json.error, ['details']))
    },
    () => {
      throw Object.assign(err, { message: 'Failed to parse JSON' })
    }
  )
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options) {
  let newUrl = url

  if (!options.method || options.method === 'GET') {
    if (options.query) {
      const queryString = serializeParams(options.query)
      newUrl = `${url}?${queryString}`
    }
  }

  return fetch(newUrl, options)
    .then(checkStatus)
    .then(parseJSON)
}

export function serializeParams(obj) {
  const str = []
  Object.keys(obj).forEach(p => {
    if (
      obj.hasOwnProperty(p) && //eslint-disable-line
      obj[p] !== undefined &&
      obj[p] !== null
    ) {
      // we need to pass 0 and empty string
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)
    }
  })
  return str.join('&')
}
