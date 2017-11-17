import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import className from 'classnames'
import { browserHistory } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { logOut } from 'containers/App/actions'
import { selectAuthenticated } from 'containers/App/selectors'
import { selectLocale } from 'containers/LanguageProvider/selectors'
import { changeLocale } from 'containers/LanguageProvider/actions'
import messages from 'containers/HomePage/messages'
import './style.scss'

class Menu extends Component {
  static propTypes = {
    logOut: PropTypes.func,
    changeLocale: PropTypes.func,
    locale: PropTypes.string,
    currentPage: PropTypes.string,
    authenticated: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = { showMenu: false }
  }

  handleMenuClick = evt => {
    evt.stopPropagation()
  }

  handleToggleMenu = evt => {
    evt.stopPropagation()
    this.setState({ showMenu: !this.state.showMenu })
  }

  render() {
    const { showMenu } = this.state
    const { authenticated, logOut, currentPage, locale, changeLocale, intl: { formatMessage } } = this.props

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
            { currentPage !== 'Home' && <li><button onClick={() => browserHistory.push('/')}>{formatMessage(messages.home)}</button></li>}
            { currentPage !== 'Quest' && <li><button onClick={() => browserHistory.push('/quest')}>{formatMessage(messages.quest)}</button></li>}
            <li><button onClick={() => { window.location.href = 'http://carta.guide' }}>{formatMessage(messages.about)}</button></li>
            {authenticated && <li><button onClick={logOut}>{formatMessage(messages.signOut)}</button></li>}
            <li><hr /></li>
            <li className={locale === 'en' ? 'activeLang' : ''}><button onClick={() => changeLocale('en')}>English</button></li>
            <li className={locale === 'nl' ? 'activeLang' : ''}><button onClick={() => changeLocale('nl')}>Netherlands</button></li>
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
  locale: selectLocale(),
})

const actions = {
  logOut,
  changeLocale,
}

export default injectIntl(connect(selectors, actions)(Menu))
