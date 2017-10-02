/*
 * HomePage
 *
 */

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import className from 'classnames';
import { browserHistory } from 'react-router';
import { Container, Row, Col } from 'reactstrap';

import { ImagePost, TextPost, NormalPost } from './Component/Posts';
import Suggestion from './Component/Suggestion';
import Quest from './Component/Quest';
import Profile from './Component/Profile';
import AuthForm from './Component/AuthForm';
import AddPostButton from './Component/AddPostButton';

import './style.scss';

export default class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      showAuthForm: false,
      showAddForm: false,
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

  googleLogin = () => {
  }

  facebookLogin = () => {
  }

  closeAuthForm = () => {
    this.setState({
      showAuthForm: false,
    });
  }

  toggleAuthForm = () => {
    this.setState({
      showAuthForm: !this.state.showAuthForm,
    });
  }

  showAddForm = () => {
    this.setState({
      showAddForm: true,
    });
  }

  render() {
    const { authType, showAuthForm, userInfo } = this.state;
    const register = authType === 'register';
    const error = 'Wrong password';

    const authFormClass = className({
      authForm: true,
      'authForm--hidden': !showAuthForm,
    });

    return (
      <Container fluid className="homepage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <img className="logo" onClick={() => { browserHistory.push('/'); }} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/logo-100.png" role="presentation" />
        <div className="logo-name-tab">
          <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/name-vertical.png" role="presentation" />
        </div>
        <Row className="homepage__row">
          <Col md={4} sm={6} className="homepage__col">
            <Profile onClick={this.toggleAuthForm} />
            <AuthForm className={authFormClass} onClose={this.closeAuthForm} />
            <Quest />
          </Col>

          <Col md={4} sm={6} className="homepage__col">
            <AddPostButton />
            <ImagePost imageUrl={'http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/wide/0012.jpg'} title={'Find your favorite weather'} username={'Martijn Snelder'} date={'Yesterday 20.30'} />
            <TextPost title={'This is a test message'} username={'Martin Snelder'} date={'Tue 26 Sep'} content={'This is post without an image. Here the writer writes all kinds of stuff, like things, this and that. Are we done already?'} />
            <NormalPost imageUrl={'http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/wide/0003.jpg'} title={'Iran'} username={'Jos Hummelen'} date={'Mon 25 Sep'} content={"Photos of Iran. This doesn't include people portraits. Those photos are reserved for the printed album I'm going to make."} />
          </Col>

          <Col md={4} sm={6} className="homepage__col">
            <Suggestion
              imageUrl="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/0027.jpg"
              title="What are your favorite coffee spots?"
            />
            <Suggestion
              imageUrl="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/0061.jpg"
              title="Best dinners in Amsterdam"
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
