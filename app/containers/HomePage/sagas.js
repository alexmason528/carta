import { call, put, select, takeLatest } from 'redux-saga/effects'
import { selectUser } from 'containers/App/selectors'
import { selectEditingPost, selectLimit, selectLastPostDate } from 'containers/HomePage/selectors'
import request from 'utils/request'
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
} from './actions'

export function* createPostWatcher() {
  yield takeLatest(CREATE_POST_REQUEST, createPostRequest)
}

export function* createPostRequest({ payload }) {
  const requestURL = `${API_BASE_URL}api/v1/post`

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
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
  const params = { method: 'DELETE' }

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
  const params = { method: 'GET' }

  try {
    const res = yield call(request, requestURL, params)
    yield put(listSuggestionSuccess(res))
  } catch (err) {
    yield put(listSuggestionFail(err.details))
  }
}

export default [listPostWatcher, createPostWatcher, updatePostWatcher, deletePostWatcher, listSuggestionWatcher]
