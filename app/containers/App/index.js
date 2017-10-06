/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import withProgressBar from 'components/ProgressBar'

const AppWrapper = styled.div`
  margin: 0 auto
  display: flex
  min-height: 100%
  flex-direction: column
`

export function App(props) {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - Carta"
        defaultTitle="Carta"
        meta={[
          { name: 'description', content: 'Carta' },
        ]}
      />
      {React.Children.toArray(props.children)}
    </AppWrapper>
  )
}


App.propTypes = {
  children: PropTypes.node,
}

export default withProgressBar(App)
