/*
 * PlacePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import $ from 'jquery';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchPlace } from './actions';
import { makeSelectPlace } from './selectors';

import './style.scss';

export class PlacePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */

  componentWillMount() {
    const placeName = this.props.params.placeName;
    this.props.fetchPlace(placeName);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    if (!this.props.place.get('details').get('info')) return null;

    let info = this.props.place.get('details').get('info').toJS();

    let mainPoster;
    let description;
    let tiles;

    mainPoster = info.main_poster;
    description = info.description;
    tiles = info.tiles;

    return (
      <div>
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <div>
          <div ref="place">
            <img role="presentation" className="logo" src="http://carta.guide/content/logo-100.png" />
            <div className="logo-name-tab">
              <img role="presentation" src="http://carta.guide/content/name-vertical.png" />
            </div>
            <div className="main-content">
              <div className="poster">
                <h1>
                  {mainPoster.title}
                </h1>
                <img role="presentation" src={mainPoster.url} />
              </div>
              <div className="description">
                <div className="col">
                  <div className="text-tile">
                    {description.text.content}
                  </div>
                </div>
                <div className="col">
                  <div className="img-tile">
                    <h2>{description.poster.title}</h2>
                    <img role="presentation" src={description.poster.url} />
                  </div>
                </div>
              </div>
            </div>

            <div className="tileset">

              {
                tiles.map((value, index) => {
                  let tile;
                  if (value.type === 'poster') {
                    const title = value.title;
                    const url = value.url;
                    tile = (
                      <div className="col" key={index}>
                        <div className="img-tile"><h2>{title}</h2><img role="presentation" src={url} /></div>
                      </div>);
                  } else {
                    const title = value.title;
                    const content = value.content;
                    tile = (
                      <div className="col" key={index}>
                        <div className="text-tile">
                          <h2>{title}</h2>
                          {content}
                        </div>
                      </div>);
                  }

                  return tile;
                })
              }

            </div>
          </div>
        </div>
      </div>
    );
  }
}

PlacePage.propTypes = {
  fetchPlace: React.PropTypes.func,
  place: React.PropTypes.object,
  params: React.PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    fetchPlace: (name) => dispatch(fetchPlace(name)),
  };
}

const mapStateToProps = createStructuredSelector({
  place: makeSelectPlace(),
});


// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(PlacePage);
