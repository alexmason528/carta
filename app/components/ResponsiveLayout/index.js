import React, { Component, PropTypes } from 'react'
import MediaQuery from 'react-responsive'

class ResponsiveLayout extends Component {
  static propTypes = {
    desktop: PropTypes.node.isRequired,
    tablet: PropTypes.node,
    mobile: PropTypes.node,
  }
  render() {
    const { desktop, tablet, mobile } = this.props
    if (!tablet) {
      return desktop
    } else {
      <MediaQuery minWidth={768}>
        {isDesktop => {
          if (isDesktop) {
            return desktop
          } else if (!mobile) {
            return tablet
          } else {
            <MediaQuery minWidth={576}>
              {isTablet => {
                if (isTablet) {
                  return tablet
                } else {
                  return mobile
                }
              }}
            </MediaQuery>
          }
        }}
      </MediaQuery>
    }
  }
}

export default ResponsiveLayout
