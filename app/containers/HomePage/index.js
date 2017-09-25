/*
 * HomePage
 *
 */

import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { browserHistory } from 'react-router';

import './style.scss';

export default class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="home-page">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <img className="logo" onClick={() => { browserHistory.push('/'); }} src="https://carta.guide/content/logo-100.png" role="presentation" />
        <div className="logo-name-tab">
          <img src="https://carta.guide/content/name-vertical.png" role="presentation" />
        </div>
        <div className="row">
          <div className="column profile-column">
            <div className="content">
            </div>
          </div>
          <div className="column wall-column">
            <div className="content">
            </div>
          </div>
          <div className="column various-column">
            <div className="content">
            </div>
          </div>
        </div>
      </div>
    );
  }
}
