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
              <div className="tile">
                <div className="profile">
                  <img src="https://carta.guide/image/wide/0025.jpg" role="presentation" />
                  <div className="profile-pic">
                    <img src="https://carta.guide/image/profile/bag/0.jpg" role="presentation" />
                  </div>
                  <h2>Sign in</h2>
                </div>
              </div>
              <div className="tile">
                <div className="auth-form">
                </div>
              </div>
              <div className="tile">
                <div className="start-quest">
                  <img src="https://carta.guide/image/quest/start/1.jpg" role="presentation" />
                  <h2>Start your personal quest</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="column wall-column">
            <div className="content">
              <div className="tile">
                <div className="post">
                  <img src="https://carta.guide/image/wide/0012.jpg" role="presentation" />
                  <h2>Find your favorite weather</h2>
                </div>
                <div className="description">
                  <div className="heading">
                    <span className="title">MARTIJN SNELDER - CARTA</span>
                    <span className="date"> | 1 day ago</span>
                  </div>
                  <p className="content">
                    We added climate and weather information to our database! So start searching for sunshine, snow, heat, or wind. Whatever you prefer!
                  </p>
                </div>
              </div>

              <div className="tile">
                <div className="post">
                  <img src="https://carta.guide/image/wide/0002.jpg" role="presentation" />
                  <h2>Iran</h2>
                </div>
                <div className="description">
                  <p className="content">
                    {"Photos of Iran. This doesn't include people portraits. Those photos are reserved for the printed album I'm going to make."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="column various-column">
            <div className="content">
              <div className="tile">
                <div className="poster">
                  <img src="https://carta.guide/image/0027.jpg" role="presentation" />
                  <h2>What are your favorite coffee spots?</h2>
                </div>
              </div>
              <div className="tile">
                <div className="poster">
                  <img src="https://carta.guide/image/0061.jpg" role="presentation" />
                  <h2>Best dinners in Amsterdam</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
