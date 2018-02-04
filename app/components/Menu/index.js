import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import { Link, withRouter, browserHistory } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { compose } from 'redux'
import { LANGUAGES } from 'containers/LanguageProvider/constants'
import messages from 'containers/HomePage/messages'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'
import { getQuestUrl } from 'utils/urlHelper'
import './style.scss'

class Menu extends Component {
  static propTypes = {
    signOutUser: PropTypes.func,
    changeLocale: PropTypes.func,
    toggleMenu: PropTypes.func,
    router: PropTypes.object,
    routes: PropTypes.array,
    location: PropTypes.object,
    username: PropTypes.string,
    authenticated: PropTypes.bool,
    menuOpened: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  getCurrentPage = () => {
    const { routes } = this.props
    return routes[1].name
  }

  handleLanguageClick = evt => {
    if (!evt.metaKey) {
      evt.preventDefault()
    }
    const { changeLocale, toggleMenu } = this.props
    changeLocale(evt.target.dataset.locale)
    toggleMenu()
  }

  handleSignOutUser = evt => {
    if (!evt.metaKey) {
      evt.preventDefault()
    }
    const { signOutUser, toggleMenu } = this.props
    signOutUser()
    toggleMenu()
    browserHistory.push('/')
  }

  handleToggleMenu = evt => {
    evt.stopPropagation()
    const { toggleMenu } = this.props
    toggleMenu()
  }

  isPage = loc => {
    const { location: { pathname } } = this.props
    if (loc === '/') {
      return pathname === '/'
    }
    return pathname.indexOf(loc) !== -1
  }

  render() {
    const { authenticated, username, intl: { formatMessage, locale }, menuOpened, toggleMenu } = this.props
    const curPage = this.getCurrentPage()

    return (
      <div className={cx({ menu: true, menu__opened: menuOpened })} onClick={this.handleToggleMenu}>
        <div className="logo" onClick={this.handleToggleMenu}>
          <Img src={`${S3_ICON_URL}/logo-100.png`} />
        </div>
        <div
          className={cx({ menu__content: true, 'menu__content--hidden': !menuOpened })}
          onClick={evt => {
            evt.stopPropagation()
          }}
        >
          <ul>
            {curPage === 'brochure' && <li className="menu--active">{formatMessage(messages.map)}</li>}
            <li className={curPage === 'home' ? 'menu--active' : ''}>
              <Link to="/" onClick={toggleMenu}>
                {formatMessage(messages.home)}
              </Link>
            </li>
            <li className={curPage === 'quest' ? 'menu--active' : ''}>
              <Link to={getQuestUrl()} onClick={toggleMenu}>
                {formatMessage(messages.quest)}
              </Link>
            </li>
            {authenticated && (
              <li className={curPage === 'profile' ? 'menu--active' : ''}>
                <Link to={`/user/${username}/profile`} onClick={toggleMenu}>
                  {formatMessage(messages.profile)}
                </Link>
              </li>
            )}
            {authenticated && (
              <li className={curPage === 'wishlist' ? 'menu--active' : ''}>
                <Link to={`/user/${username}/wishlist`} onClick={toggleMenu}>
                  {formatMessage(messages.wishlist)}
                </Link>
              </li>
            )}
            {authenticated && (
              <li className={curPage === 'friends' ? 'menu--active' : ''}>
                <Link to={`/user/${username}/friends`} onClick={toggleMenu}>
                  {formatMessage(messages.friends)}
                </Link>
              </li>
            )}
            <li className={curPage === 'theme' ? 'menu--active' : ''}>
              <Link to="/themes" onClick={toggleMenu}>
                {formatMessage(messages.themes)}
              </Link>
            </li>
            <li className={curPage === 'place' ? 'menu--active' : ''}>
              <Link to="/places" onClick={toggleMenu}>
                {formatMessage(messages.places)}
              </Link>
            </li>
            <li>
              <a href={`http://carta.guide/${locale === 'en' ? '' : locale}`}>{formatMessage(messages.about)}</a>
            </li>
            {authenticated && (
              <li>
                <a href="/" onClick={this.handleSignOutUser}>
                  {formatMessage(messages.signOut)}
                </a>
              </li>
            )}
            <hr className="My-12" />
            {LANGUAGES.map(lang => {
              const { countryCode, name } = lang
              return (
                <li key={countryCode} className={cx({ menu__language: true, 'menu--active': locale === countryCode })}>
                  <a href="/" onClick={this.handleLanguageClick} data-locale={countryCode}>
                    {name}
                  </a>
                </li>
              )
            })}
          </ul>
          <div className="menu__tab" onClick={this.handleToggleMenu}>
            <Img src={`${S3_ICON_URL}/name-vertical.png`} />
          </div>
        </div>
      </div>
    )
  }
}

export default compose(injectIntl, withRouter)(Menu)
