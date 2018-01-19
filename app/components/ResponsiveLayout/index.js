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
    return (
      <MediaQuery maxWidth={767}>
        {isMobile => {
          if (isMobile) {
            return mobile
          } else {
            return <MediaQuery maxWidth={991}>{isTablet => (isTablet ? tablet : desktop)}</MediaQuery>
          }
        }}
      </MediaQuery>
    )
  }
}

export default ResponsiveLayout
