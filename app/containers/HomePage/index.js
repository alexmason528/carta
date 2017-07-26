/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ReactMapboxGl from 'react-mapbox-gl';

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

    this.geoJSONSource = 'https://storage.googleapis.com/carta-geojson/shapes.geojson';

    this.map = '';

    this.count = 5;
  }

  componentWillReceiveProps(nextProps) {
    if (this.map) {
      nextProps.recommendations.get('details').map((recommendation, index) => {
        const display = recommendation.get('display');
        let filter = ['==', 'name', recommendation.get('name')];

        if (display === 'shape') {
          this.map.setFilter(`area-border-offset-${index}`, filter);
          this.map.setFilter(`area-border-${index}`, filter);
          this.map.setFilter(`area-fill-${index}`, filter);
          this.map.setFilter(`area-caption-${index}`, filter);
        } else if (display === 'icon') {
          this.map.setFilter(`area-border-offset-${index}`, ['==', 'name', '']);
          this.map.setFilter(`area-border-${index}`, ['==', 'name', '']);
          this.map.setFilter(`area-caption-${index}`, filter);
        }
      });
    }
  }

  onZoomEnd = (map) => {
    this.props.zoomChange(map.getZoom(), map.getBounds());
    this.props.fetchRecommendations();
  }

  onStyleLoad = (map) => {
    this.props.zoomChange(map.getZoom(), map.getBounds());
    this.props.fetchRecommendations();
    this.map = map;

    map.addSource('areas', {
      type: 'geojson',
      data: this.geoJSONSource,
    });

    for (let i = 0; i < this.count; i += 1) {
      map.addLayer({
        id: `area-fill-${i}`,
        type: 'fill',
        source: 'areas',
        layout: {},
        paint: {
          'fill-color': this.colors[i],
          'fill-opacity': 0.1,
        },
        filter: ['==', 'name', ''],
      });

      map.addLayer({
        id: `area-border-offset-${i}`,
        type: 'line',
        source: 'areas',
        layout: {},
        paint: {
          'line-color': this.colors[i],
          'line-width': 2.5,
          'line-opacity': 0.15,
          'line-offset': 1.5,
        },
      });

      map.addLayer({
        id: `area-border-${i}`,
        type: 'line',
        source: 'areas',
        layout: {},
        paint: {
          'line-color': this.colors[i],
          'line-width': 0.5,
        },
      });

      map.addLayer({
        id: `area-caption-${i}`,
        type: 'symbol',
        source: 'areas',
        layout: {
          'text-field': '{name}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 13,
        },
        paint: {
          'text-color': this.colors[i],
          'text-halo-width': 2,
          'text-halo-color': '#fff',
        },
      });

      map.addLayer({
        id: `area-fill-${i}`,
        type: 'fill',
        source: 'areas',
        layout: {},
        paint: {
          'fill-color': this.colors[i],
          'fill-opacity': 0,
        },
      });

      map.addLayer({
        id: `area-fill-hover-${i}`,
        type: 'fill',
        source: 'areas',
        layout: {},
        paint: {
          'fill-color': this.colors[i],
          'fill-opacity': 0.1,
        },
        filter: ['==', 'name', ''],
      });

      const areaFill = `area-fill-${i}`;
      const areaFillHover = `area-fill-hover-${i}`;

      map.on('mouseenter', areaFill, (e) => {
        map.setFilter(areaFillHover, ['==', 'name', e.features[0].properties.name]);
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', areaFill, () => {
        map.setFilter(areaFillHover, ['==', 'name', '']);
        map.getCanvas().style.cursor = '';
      });
    }
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
              onMouseMove={this.onMouseMove}
            >
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
