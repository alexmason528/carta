import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import './style.scss'

export default class ContentEditable extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    tabIndex: PropTypes.number,
  }

  static defaultProps = {
    placeholder: '',
  }

  shouldComponentUpdate(nextProps) {
    const component = ReactDOM.findDOMNode(this)
    return (nextProps.value !== component.innerHTML)
  }

  componentDidUpdate() {
    const { value } = this.props
    const component = ReactDOM.findDOMNode(this)
    if (value !== component.innerHTML) {
      component.innerHTML = value
    }
  }

  onChange = () => {
    const component = ReactDOM.findDOMNode(this)
    let content = component.innerHTML
    const { onChange } = this.props

    if (content !== this.lastHtml) {
      onChange(content)
    }

    this.lastHtml = content
  }

  render() {
    const { className, value, placeholder, tabIndex } = this.props

    return (
      <div
        className={`contentEditable ${className}`}
        onInput={this.onChange}
        onBlur={this.onChange}
        dangerouslySetInnerHTML={{ __html: value }}
        contentEditable
        tabIndex={tabIndex}
        data-placeholder={placeholder}
      />
    )
  }
}
