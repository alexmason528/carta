import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { browserHistory } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { signOut } from 'containers/App/actions'
import { selectAuthenticated } from 'containers/App/selectors'
import { selectLocale } from 'containers/LanguageProvider/selectors'
import { changeLocale } from 'containers/LanguageProvider/actions'
import messages from 'containers/HomePage/messages'
import './style.scss'

class Menu extends Component {
  static propTypes = {
    signOut: PropTypes.func,
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

  handleToggleMenu = evt => {
    evt.stopPropagation()
    this.setState({ showMenu: !this.state.showMenu })
  }

  render() {
    const { showMenu } = this.state
    const { authenticated, signOut, currentPage, locale, changeLocale, intl: { formatMessage } } = this.props

    return (
      <div className={cx({ menuWrapper: showMenu })} onClick={this.handleToggleMenu}>
        <div className="logo" onClick={this.handleToggleMenu}>
          <img src={`${CLOUDINARY_ICON_URL}/logo-100.png`} role="presentation" />
        </div>
        <div className={cx({ cartaMenu: true, 'cartaMenu--hidden': !showMenu })} onClick={evt => { evt.stopPropagation() }}>
          <ul>
            { currentPage !== 'Home' && <li><button onClick={() => browserHistory.push('/')}>{formatMessage(messages.home)}</button></li>}
            { currentPage !== 'Quest' && <li><button onClick={() => browserHistory.push('/quest')}>{formatMessage(messages.quest)}</button></li>}
            <li><button onClick={() => { window.location.href = 'http://carta.guide' }}>{formatMessage(messages.about)}</button></li>
            {authenticated && <li><button onClick={signOut}>{formatMessage(messages.signOut)}</button></li>}
            <li><hr /></li>
            <li className={locale === 'en' ? 'activeLang' : ''}><button onClick={() => changeLocale('en')}>English</button></li>
            <li className={locale === 'nl' ? 'activeLang' : ''}><button onClick={() => changeLocale('nl')}>Nederlands</button></li>
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
  signOut,
  changeLocale,
}

export default injectIntl(connect(selectors, actions)(Menu))
