import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  updatePostRequest,
  deletePostRequest,
  postEditStart,
  postEditEnd,
  postTitleChange,
  postContentChange,
  postImageChange,
  postLinkChange,
  postShowLinkBar,
  postShowDeleteConfirm,
} from 'containers/HomePage/actions'
import { selectEditingPost, selectHomeInfo } from 'containers/HomePage/selectors'
import MixedPost from './MixedPost'
import MediaPost from './MediaPost'
import TextPost from './TextPost'

class Post extends Component {
  static propTypes = {
    editingPost: PropTypes.object,
    info: PropTypes.object,
    _id: PropTypes.string,
    firstname: PropTypes.string,
    editable: PropTypes.bool,
  }

  render() {
    const { editingPost, _id } = this.props

    const props = editingPost && editingPost._id === _id ? { ...this.props, ...editingPost, editing: true } : { ...this.props, editing: false }

    const { img, content, title } = props
    let component
    if (img && content !== null) {
      component = <MixedPost {...props} />
    } else if (img && content === null) {
      component = <MediaPost {...props} />
    } else if ((!img && content !== null) || title !== null) {
      component = <TextPost {...props} />
    }

    return component
  }
}

const selectors = createStructuredSelector({
  editingPost: selectEditingPost(),
  info: selectHomeInfo(),
})

const actions = {
  updatePostRequest,
  deletePostRequest,
  postEditStart,
  postEditEnd,
  postTitleChange,
  postContentChange,
  postImageChange,
  postLinkChange,
  postShowLinkBar,
  postShowDeleteConfirm,
}

export default connect(selectors, actions)(Post)
