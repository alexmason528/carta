import React, { Component, PropTypes, Children } from 'react'
import './style.scss'

class Map extends Component { //eslint-disable-line
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  }
  render() {
    const { className, children } = this.props
    return (
      <div className={className}>
        {Children.toArray(children)}
      </div>
    )
  }
}

export default Map
