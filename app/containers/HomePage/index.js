/*
 * HomePage
 *
 */

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import className from 'classnames';
import { browserHistory } from 'react-router';
import { Container, Row, Col } from 'reactstrap';

import LoginForm from './Component/LoginForm';

import './style.scss';

export default class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      hideAuthForm: true,
      authType: 'login',
      userInfo: {
        email: '',
        password: '',
        confirmPassword: '',
        fullname: '',
      },
    };
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
  }

  googleLogin = (evt) => {
    evt.preventDefault();
  }

  facebookLogin = (evt) => {
    evt.preventDefault();
  }

  closeAuthForm = (evt) => {
    evt.preventDefault();

    this.setState({
      hideAuthForm: true,
    });
  }

  toggleAuthForm = (evt) => {
    const { hideAuthForm } = this.state;

    this.setState({
      hideAuthForm: !hideAuthForm,
    });
  }

  userInfoChange = (evt) => {
    this.setState({
      userInfo: {
        [evt.target.name]: evt.target.value,
      },
    });
  }

  authMethodChange = (evt) => {
    this.setState({
      authType: evt.target.name,
    });
  }

  render() {
    const { authType, hideAuthForm, userInfo } = this.state;
    const register = authType === 'register';
    const authTileClass = className({
      tile: true,
      authTile: true,
      'authTile--hidden': hideAuthForm,
    });
    const error = 'Wrong password';

    return (
      <Container fluid className="homepage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <img className="logo" onClick={() => { browserHistory.push('/'); }} src="https://carta.guide/content/logo-100.png" role="presentation" />
        <div className="logo-name-tab">
          <img src="https://carta.guide/content/name-vertical.png" role="presentation" />
        </div>
        <Row className="homepage__row">
          <Col md={4} sm={6} className="homepage__col">
            <div className="tile profileTile" onClick={this.toggleAuthForm}>
              <div className="tile__profile">
                <img src="https://carta.guide/image/wide/0025.jpg" role="presentation" />
                <div className="tile__profilePic">
                  <img src="https://carta.guide/image/profile/bag/6.jpg" role="presentation" />
                </div>
                <h2>Sign in</h2>
              </div>
            </div>
            <div className={authTileClass}>
              <button className="authTile__closeBtn" onClick={this.closeAuthForm}><img src="https://carta.guide/icon/close.png" role="presentation" /></button>
              <div className="authTile__divider">
                <span>With</span>
              </div>
              <div className="authTile__inlineButtons">
                <button onClick={this.googleLogin}><img src="https://carta.guide/icon/logo/google.png" role="presentation" /><span>Google</span></button>
                <button onClick={this.facebookLogin}><img src="https://carta.guide/icon/logo/facebook.png" role="presentation" /><span>Facebook</span></button>
              </div>
              <div className="authTile__divider">
                <span>Or</span>
              </div>
              <LoginForm handleSubmit={this.handleSubmit} />
            </div>
            <div className="tile startQuestTile">
              <div className="tile__startQuest">
                <img src="https://carta.guide/image/quest/start/1.jpg" role="presentation" />
                <h2>Start your personal quest</h2>
              </div>
            </div>
          </Col>

          <Col md={4} sm={6} className="homepage__col">
            <div className="tile">
              <div className="tile__post">
                <img src="https://carta.guide/image/wide/0012.jpg" role="presentation" />
                <h2>Find your favorite weather</h2>
              </div>
            </div>

            <div className="tile">
              <div className="tile__description">
                <div className="tile__title">
                  This is a test message
                </div>
                <div className="tile__info">
                  MARTIJN SNELDER - CARTA | TUE 26 SEP
                </div>
                <p className="tile__content">
                  {'This is post without an image. Here the writer writes all kinds of sutff, like things, this and that. Are we done already?'}
                </p>
              </div>
            </div>

            <div className="tile">
              <div className="tile__post">
                <img src="https://carta.guide/image/wide/0002.jpg" role="presentation" />
                <h2>Iran</h2>
              </div>
              <div className="tile__description">
                <div className="tile__info">
                  JOS HUMMELEN | MON 25 SEP
                </div>
                <p className="tile__content">
                  {"Photos of Iran. This doesn't include people portraits. Those photos are reserved for the printed album I'm going to make."}
                </p>
              </div>
            </div>

            <div className="addPostBtn">
              <div className="addPostBtn__img">
                <img src="https://carta.guide/icon/add-post.png" role="presentation" />
              </div>
              <div className="addPostBtn__text">
                Post
              </div>
            </div>
          </Col>

          <Col md={4} sm={6} className="homepage__col">
            <div className="tile">
              <div className="tile__suggestion">
                <img src="https://carta.guide/image/0027.jpg" role="presentation" />
                <h2>What are your favorite coffee spots?</h2>
              </div>
            </div>
            <div className="tile">
              <div className="tile__suggestion">
                <img src="https://carta.guide/image/0061.jpg" role="presentation" />
                <h2>Best dinners in Amsterdam</h2>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
