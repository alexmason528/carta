import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { Link, withRouter, browserHistory } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { signOut } from 'containers/App/actions'
import { selectAuthenticated } from 'containers/App/selectors'
import { LANGUAGES } from 'containers/LanguageProvider/constants'
import { changeLocale } from 'containers/LanguageProvider/actions'
import messages from 'containers/HomePage/messages'
import Img from 'components/Img'
import { MobileUp } from 'components/Responsive'
import './style.scss'

class Menu extends Component {
  static propTypes = {
    signOut: PropTypes.func,
    changeLocale: PropTypes.func,
    params: PropTypes.object,
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

  handleLanguageClick = evt => {
    if (!evt.metaKey) {
      evt.preventDefault()
    }
    const { changeLocale } = this.props
    changeLocale(evt.target.dataset.locale)
  }

  handleSignOut = evt => {
    if (!evt.metaKey) {
      evt.preventDefault()
    }
    const { signOut } = this.props
    signOut()
  }

  handleSettings = () => {}

  handleMap = evt => {
    evt.preventDefault()
    const { params: { viewport, types, descriptives } } = this.props
    const url = (viewport && types && descriptives) ? `/quest/${viewport}/${types}/${descriptives}/` : 'quest'
    browserHistory.push(url)
  }

  render() {
    const { showMenu } = this.state
    const {
      authenticated,
      currentPage,
      intl: {
        formatMessage,
        locale,
      },
      params: {
        brochure,
      },
    } = this.props

    return (
      <div className={cx({ menu: true, menu__opened: showMenu })} onClick={this.handleToggleMenu}>
        <div className="logo" onClick={this.handleToggleMenu}>
          <Img src={`${CLOUDINARY_ICON_URL}/logo-100.png`} />
        </div>
        <div className={cx({ menu__content: true, 'menu__content--hidden': !showMenu })} onClick={evt => { evt.stopPropagation() }}>
          <ul>
            { currentPage !== 'Home' && <li><Link to="/">{formatMessage(messages.home)}</Link></li> }
            { currentPage !== 'Quest' && <li><Link to="/quest">{formatMessage(messages.quest)}</Link></li> }
            <li><a href={`http://carta.guide/${locale === 'en' ? '' : locale}`}>{formatMessage(messages.about)}</a></li>
            { brochure && <li><a href="/" onClick={this.handleMap}>{formatMessage(messages.map)}</a></li> }
            { authenticated &&
              <div>
                <li><a href="/" onClick={this.handleSettings}>{formatMessage(messages.settings)}</a></li>
                <li><a href="/" onClick={this.handleSignOut}>{formatMessage(messages.signOut)}</a></li>
              </div>
            }
            <hr />
            {
              LANGUAGES.map(lang => {
                const { countryCode, name } = lang
                return (
                  <li
                    key={countryCode}
                    className={cx({ menu__language: true, 'menu__language--active': locale === countryCode })}
                  >
                    <a href="/" onClick={this.handleLanguageClick} data-locale={countryCode}>{name}</a>
                  </li>
                )
              })
            }
          </ul>
          <MobileUp>
            <div className="menu__tab" onClick={this.handleToggleMenu}>
              <Img src={`${CLOUDINARY_ICON_URL}/name-vertical.png`} />
            </div>
          </MobileUp>
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  authenticated: selectAuthenticated(),
})

const actions = {
  signOut,
  changeLocale,
}

export default compose(
  injectIntl,
  withRouter,
  connect(selectors, actions)
)(Menu)
