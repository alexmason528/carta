/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ReactMapboxGl, { Marker, Layer, Feature } from 'react-mapbox-gl';

import { toggleCategory, fetchRecommendations, fetchCategories } from './actions';
import { makeSelectCategories, makeSelectRecommendations } from './selectors';


import { MAP_ACCESS_TOKEN } from './constants';

import { SearchBlock, MapBlock, ScoreBoardBlock } from './Block';
import Button from './Button';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */

  componentWillMount() {
    this.mapStyle = {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          url: 'mapbox://cartaguide.bright',
          tileSize: 128,
        },
      },
      layers: [{
        id: 'simple-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22,
      }],
    };

    this.containerStyle = {
      width: '100%',
      height: '100%',
    };

    this.zoom = [0];
    this.props.fetchCategories();
  }

  componentWillUnmount() {

  }

  render() {
    const icons = ['blue', 'red', 'green', 'orange', 'yellow'];

    return (
      <div>
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <div>
          <SearchBlock>
            {
              this.props.categories.get('details').map((category, index) =>
                <Button
                  active={category.get('value')}
                  key={index}
                  onClick={() => {
                    this.props.onToggleCategory(category.get('name'));
                    this.props.fetchRecommendations();
                  }}
                >
                  {category.get('name')}
                </Button>
              )
            }
          </SearchBlock>
          <MapBlock>
            <ReactMapboxGl
              style={this.mapStyle}
              accessToken={MAP_ACCESS_TOKEN}
              containerStyle={this.containerStyle}
            >
              {
                this.props.recommendations.get('details').map((recommendation, index) =>
                  <div key={index}>
                    <Layer
                      type="fill"
                      paint={{ 'fill-color': '#d80000', 'fill-opacity': 0.1 }}
                    >
                      <Feature coordinates={recommendation.get('region').toJS()} />
                    </Layer>
                    <Marker
                      coordinates={recommendation.get('point').toJS()}
                      anchor="bottom"
                    >
                      <img src={`https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${icons[index]}.png`} role="presentation" />
                    </Marker>
                  </div>
                )
              }
            </ReactMapboxGl>
          </MapBlock>
          <ScoreBoardBlock>
            {
              this.props.recommendations.get('details').map((recommendation, index) =>
                <div key={index}>{recommendation.get('name')} : {recommendation.get('score')}</div>
              )
            }
          </ScoreBoardBlock>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  onToggleCategory: React.PropTypes.func,
  categories: React.PropTypes.object,
  recommendations: React.PropTypes.object,
  fetchRecommendations: React.PropTypes.func,
  fetchCategories: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onToggleCategory: (name) => dispatch(toggleCategory(name)),
    fetchRecommendations: () => dispatch(fetchRecommendations()),
    fetchCategories: () => dispatch(fetchCategories()),
  };
}

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(),
  recommendations: makeSelectRecommendations(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
