import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

class Resizable extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    className: PropTypes.string,
    tabIndex: PropTypes.number,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
  }

  componentDidMount() {
    this.resizeTextArea()
  }

  componentWillReceiveProps() {
    this.resizeTextArea()
  }

  handleChange = evt => {
    const { onChange } = this.props
    this.resizeTextArea()
    onChange(evt.target.value)
  }

  resizeTextArea = () => {
    const comp = ReactDOM.findDOMNode(this)
    comp.style.height = 'auto'
    comp.style.height = `${comp.scrollHeight}px`
  }

  render() {
    const { className, tabIndex, placeholder, value, disabled } = this.props
    const data = { className, tabIndex, placeholder, value, disabled }
    return (
      <textarea
        rows={1}
        onChange={this.handleChange}
        onBlur={this.resizeTextArea}
        onFocus={this.resizeTextArea}
        {...data}
      />
    )
  }
}

export default Resizable
