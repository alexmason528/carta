import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import className from 'classnames'
import { browserHistory } from 'react-router'
import { createStructuredSelector } from 'reselect'
import { logOut } from 'containers/App/actions'
import { selectAuthenticated } from 'containers/App/selectors'
import './style.scss'

class Menu extends Component {
  static propTypes = {
    logOut: PropTypes.func,
    authenticated: PropTypes.bool,
  }

  constructor() {
    super()

    this.state = {
      showMenu: false,
    }
  }

  handleToggleMenu = evt => {
    evt.stopPropagation()

    this.setState({
      showMenu: !this.state.showMenu,
    })
  }

  render() {
    const { showMenu } = this.state
    const { authenticated, logOut } = this.props

    const cartaMenuClass = className({
      cartaMenu: true,
      'cartaMenu--hidden': !showMenu,
    })

    return (
      <div className={cartaMenuClass}>
        <ul>
          <li><button onClick={() => browserHistory.push('/')}>Quest</button></li>
          <li><button>About</button></li>
          {authenticated && <li><button onClick={logOut}>Log out</button></li>}
        </ul>
        <div className="cartaMenu__tab" onClick={this.handleToggleMenu}>
          <img src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/name-vertical.png" role="presentation" />
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
