import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import className from 'classnames'
import { browserHistory } from 'react-router'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { logOut } from 'containers/App/actions'
import { selectAuthenticated } from 'containers/App/selectors'
import './style.scss'

class Menu extends Component {
  static propTypes = {
    logOut: PropTypes.func,
    currentPage: PropTypes.string,
    authenticated: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      showMenu: false,
    }
  }

  handleMenuClick = evt => {
    evt.stopPropagation()
  }

  handleToggleMenu = evt => {
    evt.stopPropagation()
    this.setState({
      showMenu: !this.state.showMenu,
    })
  }

  render() {
    const { showMenu } = this.state
    const { authenticated, logOut, currentPage } = this.props

    const cartaMenuClass = className({
      cartaMenu: true,
      'cartaMenu--hidden': !showMenu,
    })

    const wrapperClass = className({
      menuWrapper: showMenu,
    })

    return (
      <div className={wrapperClass} onClick={this.handleToggleMenu}>
        <div className="logo" onClick={this.handleToggleMenu}>
          <img src={`${CLOUDINARY_ICON_URL}/logo-100.png`} role="presentation" />
        </div>
        <div className={cartaMenuClass} onClick={this.handleMenuClick}>
          <ul>
            { currentPage !== 'Home' && <li><button onClick={() => browserHistory.push('/')}>Home</button></li>}
            { currentPage !== 'Quest' && <li><button onClick={() => browserHistory.push('/quest')}>Quest</button></li>}
            <li><button onClick={() => { window.location.href = 'http://carta.guide' }}>About</button></li>
            {authenticated && <li><button onClick={logOut}>Sign out</button></li>}
          </ul>
          <div className="cartaMenu__tab" onClick={this.handleToggleMenu}>
            <img src={`${CLOUDINARY_ICON_URL}/name-vertical.png`} role="presentation" />
          </div>
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  authenticated: selectAuthenticated(),
})

const actions = {
  logOut,
}

export default connect(selectors, actions)(Menu)
