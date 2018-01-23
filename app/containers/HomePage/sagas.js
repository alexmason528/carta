import { call, put, select, takeLatest } from 'redux-saga/effects'
import { SIGNIN_REQUEST, REGISTER_REQUEST, DELETE_USER_REQUEST, VERIFY_REQUEST, UPDATE_USER_REQUEST } from 'containers/App/constants'
import {
  signInSuccess,
  signInFail,
  registerSuccess,
  registerFail,
  deleteUserSuccess,
  deleteUserFail,
  verifySuccess,
  verifyFail,
  updateUserSuccess,
  updateUserFail,
} from 'containers/App/actions'
import { selectUser } from 'containers/App/selectors'
import { selectEditingPost, selectLimit, selectLastPostDate } from 'containers/HomePage/selectors'
import request from 'utils/request'
import { setItem, removeItem } from 'utils/localStorage'
import { API_BASE_URL } from 'utils/globalConstants'
import { CREATE_POST_REQUEST, LIST_POST_REQUEST, UPDATE_POST_REQUEST, DELETE_POST_REQUEST, LIST_SUGGESTION_REQUEST } from './constants'
import {
  createPostSuccess,
  createPostFail,
  listPostSuccess,
  listPostFail,
  updatePostSuccess,
  updatePostFail,
  deletePostSuccess,
  deletePostFail,
  listSuggestionSuccess,
  listSuggestionFail,
  deleteUserPosts,
} from './actions'

export function* signInRequestWatcher() {
  yield takeLatest(SIGNIN_REQUEST, signInRequest)
}

export function* signInRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/auth/signIn`

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res.user))
    yield call(setItem, 'wishlist', JSON.stringify(res.wishlist))
    yield put(signInSuccess(res))
  } catch (err) {
    yield put(signInFail(err.details))
  }
}

export function* registerRequestWatcher() {
  yield takeLatest(REGISTER_REQUEST, registerRequest)
}

export function* registerRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/auth/register`

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res))
    yield put(registerSuccess(res))
  } catch (err) {
    yield put(registerFail(err.details))
  }
}

export function* deleteUserWatcher() {
  yield takeLatest(DELETE_USER_REQUEST, deleteUserRequest)
}

export function* deleteUserRequest({ payload }) {
  const { id, password } = payload
  const requestURL = `${API_BASE_URL}api/v1/auth/${id}`

  const params = {
    method: 'DELETE',
    body: JSON.stringify({ password }),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    yield call(request, requestURL, params)
    yield call(removeItem, 'auth')
    yield put(deleteUserSuccess())
    yield put(deleteUserPosts(id))
  } catch (err) {
    yield put(deleteUserFail(err.details))
  }
}

export function* verifyRequestWatcher() {
  yield takeLatest(VERIFY_REQUEST, verifyRequest)
}

export function* verifyRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/auth/verify`

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res))
    yield put(verifySuccess(res))
  } catch (err) {
    yield put(verifyFail(err.details))
  }
}

export function* createPostWatcher() {
  yield takeLatest(CREATE_POST_REQUEST, createPostRequest)
}

export function* createPostRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/post`

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    const user = yield select(selectUser())
    let info = {
      ...res,
      author: {
        ...user,
      },
    }
    yield put(createPostSuccess(info))
  } catch (err) {
    yield put(createPostFail(err.details))
  }
}

export function* listPostWatcher() {
  yield takeLatest(LIST_POST_REQUEST, listPostRequest)
}

export function* listPostRequest() {
  const requestURL = `${API_BASE_URL}api/v1/post`
  const limit = yield select(selectLimit())
  const lastPostDate = yield select(selectLastPostDate())
  const params = {
    method: 'GET',
    query: Object.assign({}, { limit }, lastPostDate && { lastPostDate }),
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(listPostSuccess(res))
  } catch (err) {
    yield put(listPostFail(err.details))
  }
}

export function* updatePostWatcher() {
  yield takeLatest(UPDATE_POST_REQUEST, updatePostRequest)
}

export function* updatePostRequest() {
  const editingPost = yield select(selectEditingPost())
  const { _id, title, img, content, link } = editingPost

  const requestURL = `${API_BASE_URL}api/v1/post/${_id}`
  const payload = {
    title,
    content,
    link: link || '',
    img: img || '',
  }

  const params = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    const { _id, title, img, content, link, created_at } = res
    const info = { _id, title, img, content, link, created_at }

    yield put(updatePostSuccess(info))
  } catch (err) {
    yield put(updatePostFail(err.details))
  }
}

export function* deletePostWatcher() {
  yield takeLatest(DELETE_POST_REQUEST, deletePostRequest)
}

export function* deletePostRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/post/${payload}`

  const params = {
    method: 'DELETE',
  }

  try {
    yield call(request, requestURL, params)
    yield put(deletePostSuccess(payload))
  } catch (err) {
    yield put(deletePostFail(err.details))
  }
}

export function* listSuggestionWatcher() {
  yield takeLatest(LIST_SUGGESTION_REQUEST, listSuggestionRequest)
}

export function* listSuggestionRequest() {
  const requestURL = `${API_BASE_URL}api/v1/suggestion`

  const params = {
    method: 'GET',
  }

  try {
    const res = yield call(request, requestURL, params)
    yield put(listSuggestionSuccess(res))
  } catch (err) {
    yield put(listSuggestionFail(err.details))
  }
}

export function* updateUserWatcher() {
  yield takeLatest(UPDATE_USER_REQUEST, updateUserRequest)
}

export function* updateUserRequest({ payload }) {
  const user = yield select(selectUser())
  const requestURL = `${API_BASE_URL}api/v1/auth/${user._id}`

  const params = {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = yield call(request, requestURL, params)
    yield call(setItem, 'auth', JSON.stringify(res))
    yield put(updateUserSuccess(res))
  } catch (err) {
    yield put(updateUserFail(err.details))
  }
}

export default [
  signInRequestWatcher,
  registerRequestWatcher,
  deleteUserWatcher,
  verifyRequestWatcher,
  listPostWatcher,
  createPostWatcher,
  updatePostWatcher,
  deletePostWatcher,
  listSuggestionWatcher,
  updateUserWatcher,
]
