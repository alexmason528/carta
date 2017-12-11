export const SIGNIN_REQUEST = 'carta/App/SIGNIN_REQUEST'
export const SIGNIN_SUCCESS = 'carta/App/SIGNIN_SUCCESS'
export const SIGNIN_FAIL = 'carta/App/SIGNIN_FAIL'

export const SIGNOUT = 'carta/App/SIGNOUT'

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

export const AUTH_METHOD_CHANGE = 'carta/App/AUTH_METHOD_CHANGE'

export const API_BASE_URL = (process.env.NODE_ENV === 'production') ? 'https://cartamap.herokuapp.com/' : 'http://localhost:3000/'
export const MAP_ACCESS_TOKEN = 'pk.eyJ1IjoiY2FydGFndWlkZSIsImEiOiJjajMzNG5rcjAwMDFmMnFud3hpNW8wenJpIn0.uQaLvmopUNSmyGSI1WKynw'

export const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/hyvpvyohj/upload'
export const CLOUDINARY_UPLOAD_PRESET = 'miqo0u8m'

export const CLOUDINARY_COVER_URL = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1509974856/image/cover'
export const CLOUDINARY_ICON_URL = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1509975466/image/icon'
export const CLOUDINARY_PROFILE_URL = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1509975396/image/profile'
export const CLOUDINARY_POINTS_URL = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1510139598/data'
export const CLOUDINARY_SHAPES_URL = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1510139627/data'

export const COLORS = ['#dd0008', '#ed7000', '#009985', '#29549a', '#8f1379']
export const CENTER_COORDS = [5.822, 52.142]
