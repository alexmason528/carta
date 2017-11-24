import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
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

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillReceiveProps(nextProps) {
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const comp = ReactDOM.findDOMNode(this)
    const post = $(comp).find('.post')
    const width = $(post).width()
    if ($(post).hasClass('textPost')) {
      const fontSize = (width / 76) * 3 * 1.15
      $(post).find('.postTitleEdit').css({ fontSize: `${fontSize}px` })
      $(post).find('.postTitle').css({
        fontSize: `${fontSize}px`,
        'max-height': `${fontSize * 2 * 1.2}px`,
        '-webkit-line-clamp': '2',
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
      })
    } else {
      const height = $(post).find('.postImage').height() - ($(post).hasClass('mediaPost') ? 90 : 65)
      const fontSize = (width / 44) * 3 * 1.15
      const lines = fontSize > 0 ? Math.floor(height / (fontSize * 1.2)) : 0

      $(post).find('.postTitle').css({
        'font-size': `${fontSize}px`,
        'max-height': `${fontSize * lines * 1.2}px`,
        '-webkit-line-clamp': lines.toString(),
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
      })
      $(post).find('.postTitleEdit').css({
        'fotn-size': `${fontSize}px`,
        'max-height': `${fontSize * lines * 1.2}px`,
      })
    }
  }

  render() {
    const { editingPost, _id, firstname, info, editable } = this.props

    let data
    if (editingPost && editingPost._id === _id) {
      data = { ...editingPost, editable, firstname, info, editing: true }
    } else {
      data = { ...this.props, editable, info, editing: false }
    }

    const { img, content, title } = data

    let component
    if (img && content !== null) {
      component = <MixedPost {...data} />
    } else if (img && content === null) {
      component = <MediaPost {...data} />
    } else if (!img && content !== null) {
      component = <TextPost {...data} />
    } else if (title !== null) {
      component = <TextPost {...data} />
    }

    return component
  }
}

const selectors = createStructuredSelector({
  editingPost: selectEditingPost(),
  info: selectHomeInfo(),
})

export default connect(selectors)(Post)
