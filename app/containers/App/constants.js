export const LOGIN_REQUEST = 'carta/App/LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'carta/App/LOGIN_SUCCESS'
export const LOGIN_ERROR = 'carta/App/LOGIN_ERROR'

export const REGISTER_REQUEST = 'carta/App/REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'carta/App/REGISTER_SUCCESS'
export const REGISTER_ERROR = 'carta/App/REGISTER_ERROR'

export const API_BASE_URL = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : 'https://cartamap.herokuapp.com/'
