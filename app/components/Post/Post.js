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

    let data
    if (editingPost && editingPost._id === _id) {
      data = { ...this.props, ...editingPost, editing: true }
    } else {
      data = { ...this.props, editing: false }
    }

    const { img, content, title } = data
    let component
    if (img && content !== null) {
      component = <MixedPost {...data} />
    } else if (img && content === null) {
      component = <MediaPost {...data} />
    } else if ((!img && content !== null) || title !== null) {
      component = <TextPost {...data} />
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
