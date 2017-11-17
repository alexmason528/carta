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

export const UPDATE_USER_REQUEST = 'carta/App/UPDATE_USER_REQUEST'
export const UPDATE_USER_SUCCESS = 'carta/App/UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAIL = 'carta/App/UPDATE_USER_FAIL'

export const API_BASE_URL = (process.env.NODE_ENV === 'production') ? 'https://cartamap.herokuapp.com/' : 'http://localhost:3000/'
export const MAP_ACCESS_TOKEN = 'pk.eyJ1IjoiY2FydGFndWlkZSIsImEiOiJjajMzNG5rcjAwMDFmMnFud3hpNW8wenJpIn0.uQaLvmopUNSmyGSI1WKynw'

export const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/hyvpvyohj/upload'
export const CLOUDINARY_UPLOAD_PRESET = 'miqo0u8m'

export const CLOUDINARY_COVER_URL = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1509974856/image/cover'
export const CLOUDINARY_ICON_URL = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1509975466/image/icon'
export const CLOUDINARY_PROFILE_URL = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1509975396/image/profile'
export const CLOUDINARY_POINTS_URL = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1510139598/data'
export const CLOUDINARY_SHAPES_URL = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1510139627/data'

export const DEFAULT_LOCALE = 'en'
