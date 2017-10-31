export const LOGIN_REQUEST = 'carta/App/LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'carta/App/LOGIN_SUCCESS'
export const LOGIN_FAIL = 'carta/App/LOGIN_FAIL'

export const LOGOUT = 'carta/App/LOGOUT'

export const REGISTER_REQUEST = 'carta/App/REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'carta/App/REGISTER_SUCCESS'
export const REGISTER_FAIL = 'carta/App/REGISTER_FAIL'

export const VERIFY_REQUEST = 'carta/App/VERIFY_REQUEST'
export const VERIFY_SUCCESS = 'carta/App/VERIFY_SUCCESS'
export const VERIFY_FAIL = 'carta/App/VERIFY_FAIL'

export const DELETE_USER_REQUEST = 'carta/App/DELETE_USER_REQUEST'
export const DELETE_USER_SUCCESS = 'carta/App/DELETE_USER_SUCCESS'
export const DELETE_USER_FAIL = 'carta/App/DELETE_USER_FAIL'

export const UPDATE_COVER_IMG_REQUEST = 'carta/App/UPDATE_COVER_IMG_REQUEST'
export const UPDATE_COVER_IMG_SUCCESS = 'carta/App/UPDATE_COVER_IMG_SUCCESS'
export const UPDATE_COVER_IMG_FAIL = 'carta/App/UPDATE_COVER_IMG_FAIL'

export const UPDATE_PROFILE_PIC_REQUEST = 'carta/App/UPDATE_PROFILE_PIC_REQUEST'
export const UPDATE_PROFILE_PIC_SUCCESS = 'carta/App/UPDATE_PROFILE_PIC_SUCCESS'
export const UPDATE_PROFILE_PIC_FAIL = 'carta/App/UPDATE_PROFILE_PIC_FAIL'

export const API_BASE_URL = (process.env.NODE_ENV === 'production') ? 'https://cartamap.herokuapp.com/' : 'http://localhost:3000/'
export const MAP_ACCESS_TOKEN = 'pk.eyJ1IjoiY2FydGFndWlkZSIsImEiOiJjajMzNG5rcjAwMDFmMnFud3hpNW8wenJpIn0.uQaLvmopUNSmyGSI1WKynw'
