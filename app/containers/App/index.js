import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { createStructuredSelector } from 'reselect'
import { signOutUser, toggleMenu } from 'containers/App/actions'
import { selectAuthenticated, selectMenuState, selectUsername } from 'containers/App/selectors'
import { changeLocale } from 'containers/LanguageProvider/actions'
import Menu from 'components/Menu'

const AppWrapper = styled.div`
  margin: 0 auto
  display: flex
  min-height: 100%
  flex-direction: column
`

class App extends Component {
  static propTypes = {
    changeLocale: PropTypes.func,
    signOutUser: PropTypes.func,
    toggleMenu: PropTypes.func,
    authenticated: PropTypes.bool,
    username: PropTypes.string,
    menuOpened: PropTypes.bool,
    children: PropTypes.node,
  }

  render() {
    const menuProps = { ...this.props }
    return (
      <AppWrapper>
        <Helmet titleTemplate="%s - Carta" defaultTitle="Carta" meta={[{ name: 'description', content: 'Carta' }]} />
        <Menu {...menuProps} />
        {React.Children.toArray(this.props.children)}
      </AppWrapper>
    )
  }
}

const selectors = createStructuredSelector({
  authenticated: selectAuthenticated(),
  username: selectUsername(),
  menuOpened: selectMenuState(),
})

const actions = {
  changeLocale,
  signOutUser,
  toggleMenu,
}

export default connect(selectors, actions)(App)
