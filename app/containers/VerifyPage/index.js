/*
 * VerifyPage
 *
 */

import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import className from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container, Row, Col } from 'reactstrap'
import Logo from 'components/Logo'
import LogoTab from 'components/LogoTab'
import './style.scss'

const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default class VerifyPage extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Container fluid className="verifypage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <Logo />
        <LogoTab />
        <Row className="verifypage__row">
          <Col md={12} sm={12} className="verifypage__col">
            <img className="verifypage__background" src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/wide/0035.jpg" role="presentation" />
          </Col>
        </Row>
      </Container>
    )
  }
}
