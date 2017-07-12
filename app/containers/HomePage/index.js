/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

import { toggleCategory, zoomChange, fetchRecommendations, fetchCategories } from './actions';
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

    this.center = [5, 52];
    this.zoomlevel = [7];

    this.props.fetchCategories();
    this.paintStyle = {
      'fill-color': '#ff0000',
      'fill-opacity': 0.7,
    };
  }

  componentWillUnmount() {

  }

  onZoomEnd = (map) => {
    this.props.zoomChange(map.getZoom(), map.getBounds());
    this.props.fetchRecommendations();
  }

  onStyleLoad = (map) => {
    this.props.zoomChange(map.getZoom(), map.getBounds());
    this.props.fetchRecommendations();
  }

  onDragEnd = (map) => {
    this.props.zoomChange(map.getZoom(), map.getBounds());
    this.props.fetchRecommendations();
  }

  render() {
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
                  {category.get('name').replace(/_/g, ' ')}
                </Button>
              )
            }
          </SearchBlock>
          <MapBlock>
            <ReactMapboxGl
              style={this.mapStyle}
              accessToken={MAP_ACCESS_TOKEN}
              containerStyle={this.containerStyle}
              center={this.center}
              zoomlevel={this.zoomlevel}
              onZoomEnd={this.onZoomEnd}
              onStyleLoad={this.onStyleLoad}
              onDragEnd={this.onDragEnd}
              onResize={this.onResize}
            >
              {
                this.props.recommendations.get('details').map((recommendation, index) => {
                  const e = recommendation.get('e');
                  const geojson = require(`../Shapes/e__${e}.geojson`);
                  const coords = geojson.features[0].geometry.coordinates;

                  return (
                    <Layer
                      key={index}
                      type="fill"
                      paint={this.paintStyle}
                    >
                      <Feature coordinates={coords} />
                    </Layer>
                  );
                })
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
  zoomChange: React.PropTypes.func,
  fetchRecommendations: React.PropTypes.func,
  fetchCategories: React.PropTypes.func,
  categories: React.PropTypes.object,
  recommendations: React.PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    onToggleCategory: (name) => dispatch(toggleCategory(name)),
    zoomChange: (zoomlevel, viewport) => dispatch(zoomChange(zoomlevel, viewport)),
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
