/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';

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
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    };

    this.containerStyle = {
      width: '100%',
      height: '100%',
    };

    this.center = [5.822, 52.142];
    this.zoom = [6];

    this.props.fetchCategories();
    this.colors = ['#dd0008', '#ed7000', '#009985', '#29549a', '#8f1379'];
    this.symbolLayout = {
      'text-field': '{place}',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-size': 13,
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
              zoom={this.zoom}
              onZoomEnd={this.onZoomEnd}
              onStyleLoad={this.onStyleLoad}
              onDragEnd={this.onDragEnd}
              onResize={this.onResize}
            >
              {
                this.props.recommendations.get('details').map((recommendation, index) => {
                  let recommendationElem;

                  const display = recommendation.get('display');
                  const name = recommendation.get('name').toUpperCase();
                  const coordinates = [recommendation.get('x'), recommendation.get('y')];
                  const geojson = `https://storage.googleapis.com/carta-geojson/e__${recommendation.get('e')}.geojson`;
                  const source = {
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        properties: {
                          place: name,
                        },
                        geometry: {
                          type: 'Point',
                          coordinates: coordinates,
                        },
                      },
                    ],
                  };

                  const fillPaint = {
                    'fill-color': this.colors[index % 5],
                    'fill-opacity': 0.1,
                  };

                  const linePaint = {
                    'line-color': this.colors[index % 5],
                    'line-width': 1,
                  };

                  const lineOffsetPaint = {
                    'line-color': this.colors[index % 5],
                    'line-width': 1.5,
                    'line-opacity': 0.3,
                    'line-offset': 2,
                  };

                  const symbolPaint = {
                    'text-color': this.colors[index % 5],
                    'text-halo-width': 2,
                    'text-halo-color': '#fff',
                  };

                  if (display === 'shape') {
                    recommendationElem = (
                      <div key={index}>
                        <GeoJSONLayer data={geojson} fillPaint={fillPaint} />
                        <GeoJSONLayer data={geojson} linePaint={linePaint} />
                        <GeoJSONLayer data={geojson} linePaint={lineOffsetPaint} />
                        <GeoJSONLayer data={source} symbolLayout={this.symbolLayout} symbolPaint={symbolPaint} />
                      </div>);
                  } else if (display === 'icon') {
                    recommendationElem = (
                      <GeoJSONLayer data={source} symbolLayout={this.symbolLayout} symbolPaint={symbolPaint} />
                    );
                  }

                  return recommendationElem;
                })
              }
            </ReactMapboxGl>
          </MapBlock>
          <ScoreBoardBlock>
            {
              this.props.recommendations.get('details').map((recommendation, index) =>
                <div key={index} style={{ color: this.colors[index % 5] }}>{recommendation.get('name')} : {recommendation.get('score')}</div>
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
