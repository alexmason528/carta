import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { IntlProvider } from 'react-intl'
import { selectLocale } from './selectors'

export class LanguageProvider extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { locale, messages, children } = this.props
    return (
      <IntlProvider locale={locale} key={locale} messages={messages[locale]}>
        {React.Children.only(children)}
      </IntlProvider>
    );
  }
}

LanguageProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
}

const selectors = createStructuredSelector({
  locale: selectLocale(),
})

export default connect(selectors)(LanguageProvider)
