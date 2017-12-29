import {
  INIT,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAIL,
  LIST_POST_REQUEST,
  LIST_POST_SUCCESS,
  LIST_POST_FAIL,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAIL,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAIL,
  LIST_SUGGESTION_REQUEST,
  LIST_SUGGESTION_SUCCESS,
  LIST_SUGGESTION_FAIL,
  DELETE_USER_POSTS,
  POST_EDIT_START,
  POST_EDIT_END,
  POST_TITLE_CHANGE,
  POST_CONTENT_CHANGE,
  POST_IMAGE_CHANGE,
  POST_LINK_CHANGE,
  POST_SHOW_LINK_BAR,
  POST_SHOW_DELETE_CONFIRM,
} from './constants'

const initialState = {
  posts: [],
  suggestions: [],
  editingPost: null,
  status: INIT,
  error: null,
}

function homeReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case CREATE_POST_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case CREATE_POST_SUCCESS:
      return {
        ...state,
        posts: [payload, ...state.posts],
        status: type,
        error: null,
      }

    case CREATE_POST_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case LIST_POST_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case LIST_POST_SUCCESS:
      return {
        ...state,
        status: type,
        posts: payload,
      }

    case LIST_POST_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case UPDATE_POST_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case UPDATE_POST_SUCCESS:
      const newPosts = state.posts.map(post => {
        if (post._id !== payload._id) return post
        return {
          ...post,
          ...payload,
        }
      })

      return {
        ...state,
        editingPost: null,
        posts: newPosts,
        status: type,
      }

    case UPDATE_POST_FAIL:
      return {
        ...state,
        editingPost: null,
        status: type,
        error: payload,
      }

    case DELETE_POST_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case DELETE_POST_SUCCESS:
      return {
        ...state,
        editingPost: null,
        status: type,
        posts: state.posts.filter(post => post._id !== payload),
      }

    case DELETE_POST_FAIL:
      return {
        ...state,
        editingPost: null,
        status: type,
        error: payload,
      }

    case LIST_SUGGESTION_REQUEST:
      return {
        ...state,
        status: type,
        error: null,
      }

    case LIST_SUGGESTION_SUCCESS:
      return {
        ...state,
        status: type,
        suggestions: payload,
      }

    case LIST_SUGGESTION_FAIL:
      return {
        ...state,
        status: type,
        error: payload,
      }

    case DELETE_USER_POSTS:
      return {
        ...state,
        status: type,
        error: null,
        posts: state.posts.filter(post => post.author._id !== payload),
      }

    case POST_EDIT_START:
      return {
        ...state,
        editingPost: payload,
      }

    case POST_EDIT_END:
      return {
        ...state,
        editingPost: null,
      }

    case POST_TITLE_CHANGE:
      return {
        ...state,
        editingPost: {
          ...state.editingPost,
          title: payload,
        },
      }

    case POST_CONTENT_CHANGE:
      return {
        ...state,
        editingPost: {
          ...state.editingPost,
          content: payload,
        },
      }

    case POST_IMAGE_CHANGE:
      return {
        ...state,
        editingPost: {
          ...state.editingPost,
          img: payload,
        },
      }

    case POST_LINK_CHANGE:
      return {
        ...state,
        editingPost: {
          ...state.editingPost,
          link: payload,
        },
      }

    case POST_SHOW_LINK_BAR:
      return {
        ...state,
        editingPost: {
          ...state.editingPost,
          showLinkBar: payload,
        },
      }

    case POST_SHOW_DELETE_CONFIRM:
      return {
        ...state,
        editingPost: {
          ...state.editingPost,
          showDeleteConfirm: payload,
        },
      }

    default:
      return state
  }
}

export default homeReducer
