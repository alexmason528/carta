import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class ContentEditable extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editable: PropTypes.bool,
    content: PropTypes.string,
    className: PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    const component = ReactDOM.findDOMNode(this)
    return (nextProps.content !== component.innerHTML) || (nextProps.editable !== this.props.editable)
  }

  componentDidUpdate() {
    const component = ReactDOM.findDOMNode(this)
    if (this.props.content !== component.innerHTML) {
      component.innerHTML = this.props.content
    }
  }

  onChange = (evt) => {
    const component = ReactDOM.findDOMNode(this)
    const content = component.innerHTML
    const { onChange } = this.props

    if (content !== this.lastHtml) {
      onChange(content)
    }

    this.lastHtml = content
  }

  render() {
    const { className, editable, content } = this.props
    return (
      <div
        className={className}
        onInput={this.onChange}
        onBlur={this.onChange}
        dangerouslySetInnerHTML={{ __html: content }}
        contentEditable={editable}
      />
    )
  }
}
