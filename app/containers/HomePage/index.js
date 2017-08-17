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
import classNames from 'classnames';
import { browserHistory } from 'react-router';

import { toggleCategory, zoomChange, fetchRecommendations, fetchCategories } from './actions';
import { makeSelectCategories, makeSelectRecommendations } from './selectors';

import { MAP_ACCESS_TOKEN } from './constants';

import { MapBlock, ScoreBoardBlock } from './Components/Block';
import QuestBlock from './Components/QuestBlock';
import Button from './Components/Button';
import SearchButton from './Components/SearchButton';
import './style.scss';

const Map = ReactMapboxGl({ accessToken: MAP_ACCESS_TOKEN });

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  constructor() {
    super();

    this.state = {
      showQuest: false,
    };
  }

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

    this.shapesGeoJSONSource = 'https://storage.googleapis.com/carta-geojson/shapes.geojson';
    this.pointsGeoJSONSource = 'https://storage.googleapis.com/carta-geojson/points.geojson';

    this.map = '';

    this.count = 5;
  }

  componentWillReceiveProps(nextProps) {
    if (this.map) {
      this.clearMap();
      nextProps.recommendations.get('details').map((recommendation, index) => {
        const display = recommendation.get('display');
        let filter = ['==', 'e', recommendation.get('e')];

        if (display === 'shape') {
          this.map.setFilter(`shape-border-offset-${index}`, filter);
          this.map.setFilter(`shape-border-${index}`, filter);
          this.map.setFilter(`shape-fill-${index}`, filter);
          this.map.setFilter(`shape-caption-${index}`, filter);
        } else if (display === 'icon') {
          this.map.setFilter(`shape-border-offset-${index}`, ['==', 'e', '']);
          this.map.setFilter(`shape-border-${index}`, ['==', 'e', '']);
          this.map.setFilter(`shape-caption-${index}`, filter);
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

    map.addSource('shapes', {
      type: 'geojson',
      data: this.shapesGeoJSONSource,
    });

    map.addSource('points', {
      type: 'geojson',
      data: this.pointsGeoJSONSource,
    });

    for (let i = 0; i < this.count; i += 1) {
      map.addLayer({
        id: `shape-fill-${i}`,
        type: 'fill',
        source: 'shapes',
        layout: {},
        paint: {
          'fill-color': this.colors[i],
          'fill-opacity': 0.1,
        },
        filter: ['==', 'e', ''],
      });

      map.addLayer({
        id: `shape-border-offset-${i}`,
        type: 'line',
        source: 'shapes',
        layout: {},
        paint: {
          'line-color': this.colors[i],
          'line-width': 2.5,
          'line-opacity': 0.15,
          'line-offset': 1.5,
        },
        filter: ['==', 'e', ''],
      });

      map.addLayer({
        id: `shape-border-${i}`,
        type: 'line',
        source: 'shapes',
        layout: {},
        paint: {
          'line-color': this.colors[i],
          'line-width': 0.5,
        },
        filter: ['==', 'e', ''],
      });

      map.addLayer({
        id: `shape-caption-${i}`,
        type: 'symbol',
        source: 'points',
        layout: {
          'text-field': '{name}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 13,
          'text-transform': 'uppercase',
        },
        paint: {
          'text-color': this.colors[i],
          'text-halo-width': 2,
          'text-halo-color': '#fff',
        },
        filter: ['==', 'e', ''],
      });

      map.addLayer({
        id: `shape-fill-${i}`,
        type: 'fill',
        source: 'shapes',
        layout: {},
        paint: {
          'fill-color': this.colors[i],
          'fill-opacity': 0,
        },
        filter: ['==', 'e', ''],
      });

      const shapeFill = `shape-fill-${i}`;
      const shapeCaption = `shape-caption-${i}`;

      map.on('mousemove', shapeFill, () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', shapeFill, () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('mousemove', shapeCaption, () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', shapeCaption, () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', shapeFill, (data) => {
        const name = data.features[0].properties.name;
        this.placeClicked(name);
      });

      map.on('click', shapeCaption, (data) => {
        const name = data.features[0].properties.name;
        this.placeClicked(name);
      });
    }
  }

  onDragEnd = (map) => {
    this.props.zoomChange(map.getZoom(), map.getBounds());
    this.props.fetchRecommendations();
  }

  clearMap = () => {
    this.props.recommendations.get('details').map((recommendation, index) => {
      let filter = ['==', 'e', ''];

      this.map.setFilter(`shape-border-offset-${index}`, filter);
      this.map.setFilter(`shape-border-${index}`, filter);
      this.map.setFilter(`shape-fill-${index}`, filter);
      this.map.setFilter(`shape-caption-${index}`, filter);
    });
  }

  placeClicked = (name) => {
    browserHistory.push(`/place/${name}`);
  }

  searchButtonClicked = () => {
    this.setState({
      showQuest: !this.state.showQuest,
    });
  }

  minimizeClicked = () => {
    this.setState({
      showQuest: false,
    });
  }

  closeClicked = () => {
    this.setState({
      showQuest: false,
    });
  }

  render() {
    const { showQuest } = this.state;

    const mapBlockClass = classNames({
      'no-quest-block': !showQuest,
    });

    const questBlockClass = classNames({
      'quest-block': true,
      hidden: !showQuest,
    });

    return (
      <div className="home-page">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <img className="logo" src="https://carta.guide/content/logo-100.png" role="presentation" />

        <SearchButton
          onClick={this.searchButtonClicked}
        />
        <QuestBlock className={questBlockClass} minimizeClicked={this.minimizeClicked} closeClicked={this.closeClicked}>
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
        </QuestBlock>
        <MapBlock className={mapBlockClass}>
          <Map
            style={this.mapStyle}
            containerStyle={this.containerStyle}
            center={this.center}
            zoom={this.zoom}
            onZoomEnd={this.onZoomEnd}
            onStyleLoad={this.onStyleLoad}
            onDragEnd={this.onDragEnd}
          />
        </MapBlock>
        <ScoreBoardBlock>
          {
            this.props.recommendations.get('details').map((recommendation, index) =>
              <div key={index} style={{ color: this.colors[index % 5] }}>{recommendation.get('name')} : {recommendation.get('score')}</div>
            )
          }
        </ScoreBoardBlock>
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
