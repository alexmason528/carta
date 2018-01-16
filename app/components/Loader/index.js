import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import './style.scss'

class Loader extends Component {
  static propTypes = {
    className: PropTypes.string,
  }

  render() {
    const { className } = this.props
    return <div className={cx({ loader: true, [className]: className })} />
  }
}

export default Loader
