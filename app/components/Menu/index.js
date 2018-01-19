import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { Link, withRouter } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { signOut, toggleMenu } from 'containers/App/actions'
import { selectAuthenticated, selectMenuState, selectUsername } from 'containers/App/selectors'
import { LANGUAGES } from 'containers/LanguageProvider/constants'
import { changeLocale } from 'containers/LanguageProvider/actions'
import messages from 'containers/HomePage/messages'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'
import './style.scss'

class Menu extends Component {
  static propTypes = {
    signOut: PropTypes.func,
    changeLocale: PropTypes.func,
    toggleMenu: PropTypes.func,
    params: PropTypes.object,
    router: PropTypes.object,
    currentPage: PropTypes.string,
    username: PropTypes.string,
    authenticated: PropTypes.bool,
    menuOpened: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  handleLanguageClick = evt => {
    if (!evt.metaKey) {
      evt.preventDefault()
    }
    const { changeLocale, toggleMenu } = this.props
    changeLocale(evt.target.dataset.locale)
    toggleMenu()
  }

  handleSignOut = evt => {
    if (!evt.metaKey) {
      evt.preventDefault()
    }
    const { signOut, toggleMenu } = this.props
    signOut()
    toggleMenu()
  }

  handleMap = evt => {
    evt.preventDefault()
    const { params: { viewport, types, descriptives }, toggleMenu, router } = this.props
    const url = viewport && types && descriptives ? `/quest/${viewport}/${types}/${descriptives}` : '/quest'
    router.push(url)
    toggleMenu()
  }

  handleToggleMenu = evt => {
    evt.stopPropagation()
    const { toggleMenu } = this.props
    toggleMenu()
  }

  render() {
    const { authenticated, currentPage, username, intl: { formatMessage, locale }, params: { brochure }, menuOpened, toggleMenu } = this.props

    return (
      <div className={cx({ menu: true, menu__opened: menuOpened })} onClick={this.handleToggleMenu}>
        <div className="logo Cr-P" onClick={this.handleToggleMenu}>
          <Img src={`${S3_ICON_URL}/logo-100.png`} />
        </div>
        <div
          className={cx({
            menu__content: true,
            'menu__content--hidden': !menuOpened,
          })}
          onClick={evt => {
            evt.stopPropagation()
          }}
        >
          <ul>
            {brochure && (
              <li>
                <a href="/" onClick={this.handleMap}>
                  {formatMessage(messages.map)}
                </a>
              </li>
            )}
            {currentPage !== 'home' && (
              <li>
                <Link to="/" onClick={toggleMenu}>
                  {formatMessage(messages.home)}
                </Link>
              </li>
            )}
            {authenticated &&
              currentPage !== 'profile' && (
                <li>
                  <Link to={`/user/${username}/profile`} onClick={toggleMenu}>
                    {formatMessage(messages.profile)}
                  </Link>
                </li>
              )}
            {authenticated &&
              currentPage !== 'starlist' && (
                <li>
                  <Link to={`/user/${username}/starlist`} onClick={toggleMenu}>
                    {formatMessage(messages.starlist)}
                  </Link>
                </li>
              )}
            {authenticated &&
              currentPage !== 'friends' && (
                <li>
                  <Link to={`/user/${username}/friends`} onClick={toggleMenu}>
                    {formatMessage(messages.friends)}
                  </Link>
                </li>
              )}
            {currentPage !== 'quest' && (
              <li>
                <Link to="/quest" onClick={toggleMenu}>
                  {formatMessage(messages.quest)}
                </Link>
              </li>
            )}
            {currentPage !== 'places' && (
              <li>
                <Link to="/places" onClick={toggleMenu}>
                  {formatMessage(messages.places)}
                </Link>
              </li>
            )}
            {currentPage !== 'themes' && (
              <li>
                <Link to="/themes" onClick={toggleMenu}>
                  {formatMessage(messages.themes)}
                </Link>
              </li>
            )}
            <li>
              <a href={`http://carta.guide/${locale === 'en' ? '' : locale}`}>{formatMessage(messages.about)}</a>
            </li>
            {authenticated && (
              <div>
                <li>
                  <a href="/" onClick={this.handleSignOut}>
                    {formatMessage(messages.signOut)}
                  </a>
                </li>
              </div>
            )}
            <hr className="My-12" />
            {LANGUAGES.map(lang => {
              const { countryCode, name } = lang
              return (
                <li
                  key={countryCode}
                  className={cx({
                    menu__language: true,
                    'menu__language--active': locale === countryCode,
                  })}
                >
                  <a href="/" onClick={this.handleLanguageClick} data-locale={countryCode}>
                    {name}
                  </a>
                </li>
              )
            })}
          </ul>
          <div className="menu__tab Cr-P P-7 Bs-Cb P-A" onClick={this.handleToggleMenu}>
            <Img src={`${S3_ICON_URL}/name-vertical.png`} />
          </div>
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  username: selectUsername(),
  authenticated: selectAuthenticated(),
  menuOpened: selectMenuState(),
})

const actions = {
  signOut,
  changeLocale,
  toggleMenu,
}

export default compose(injectIntl, withRouter, connect(selectors, actions))(Menu)
