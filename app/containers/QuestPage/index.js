/*
 * QuestPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import ReactMapboxGl from 'react-mapbox-gl';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';

import { mapChange, fetchQuestInfo, fetchRecommendations, setDefaultQuest } from './actions';
import { makeSelectRecommendations, makeSelectPlaces } from './selectors';

import { MAP_ACCESS_TOKEN } from './constants';

import { MapBlock, ScoreBoardBlock } from './Components/Blocks';

import QuestPanel from './Components/QuestPanel';
import Brochure from './Components/Brochure';

import URLParser from '../../utils/questURLparser';

import { Button, QuestButton } from './Components/Buttons';

import './style.scss';

const Map = ReactMapboxGl({ accessToken: MAP_ACCESS_TOKEN });

class QuestPage extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();

    this.state = {
      showQuest: true,
      minimized: false,
      closed: false,
    };
  }

  componentWillMount() {
    // const { viewport, types, descriptives } = this.props.params;

    // if (viewport && types && descriptives) {
    //   const res = URLParser({ viewport, types, descriptives });

    //   if (!res.error) {
    //     this.props.setDefaultQuest(res.data);
    //     console.log(res.data);
    //     this.props.fetchRecommendations();
    //   }
    // }

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

    this.props.fetchQuestInfo();

    this.colors = ['#dd0008', '#ed7000', '#009985', '#29549a', '#8f1379'];

    this.shapesGeoJSONSource = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506359935/shapes.geojson';
    this.pointsGeoJSONSource = 'https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506359923/points.geojson';

    this.map = '';

    this.count = 5;

    this.redrawMap(this.props);
  }

  componentDidMount() {
    $('.place-search').focus();
    $('.descriptive-search').focus();
    $('.type-search').focus();
  }

  componentWillReceiveProps(nextProps) {
    this.redrawMap(nextProps);
  }

  onZoomEnd = (map) => {
    this.props.mapChange({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
    });

    const { showQuest, minimized, closed } = this.state;

    if (showQuest || minimized) {
      this.props.fetchRecommendations();
    }
  }

  onStyleLoad = (map) => {
    this.props.mapChange({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
    });

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

    this.addShapes(map);
    this.addCaptions(map);
  }

  onDragEnd = (map) => {
    this.props.mapChange({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
    });

    const { showQuest, minimized, closed } = this.state;

    if (showQuest || minimized) {
      this.props.fetchRecommendations();
    }
  }

  addShapes = (map) => {
    for (let i = this.count - 1; i >= 0; i -= 1) {
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

      const shapeFill = `shape-fill-${i}`;

      map.on('mousemove', shapeFill, () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', shapeFill, () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', shapeFill, (data) => {
        const name = data.features[0].properties.name;
        this.elementClicked(name);
      });
    }
  }

  addCaptions = (map) => {
    for (let i = this.count - 1; i >= 0; i -= 1) {
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

      const shapeCaption = `shape-caption-${i}`;

      map.on('mousemove', shapeCaption, () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', shapeCaption, () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', shapeCaption, (data) => {
        const name = data.features[0].properties.name;
        this.elementClicked(name);
      });
    }
  }

  redrawMap(props) {
    if (this.map) {
      this.clearMap();

      props.recommendations.get('details').map((recommendation, index) => {
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

  clearMap = () => {
    this.props.recommendations.get('details').map((recommendation, index) => {
      let filter = ['==', 'e', ''];

      this.map.setFilter(`shape-border-offset-${index}`, filter);
      this.map.setFilter(`shape-border-${index}`, filter);
      this.map.setFilter(`shape-fill-${index}`, filter);
      this.map.setFilter(`shape-caption-${index}`, filter);
    });
  }

  mapViewPortChange = (placeName) => {
    const { places } = this.props;

    for (let place of places) {
      if (place.name === placeName) {
        const { x, y, zoom } = place;
        this.map.flyTo({
          center: [x, y],
          zoom: zoom,
        });
      }
    }
  }

  elementClicked = (name) => {
    browserHistory.push(`/i/${name}`);
  }

  questButtonClicked = () => {
    this.setState({
      showQuest: !this.state.showQuest,
      minimized: false,
      closed: false,
    });

    this.redrawMap(this.props);

    $('.place-search').focus();
    $('.descriptive-search').focus();
    $('.type-search').focus();
  }

  minimizeClicked = () => {
    this.setState({
      showQuest: false,
      minimized: true,
      closed: false,
    });
  }

  closeClicked = () => {
    this.setState({
      showQuest: false,
      minimized: false,
      closed: true,
    });

    if (this.map) {
      this.clearMap();
    }
  }

  render() {
    const { showQuest, minimized, closed } = this.state;
    const { brochure } = this.props.params;

    const mapBlockClass = classNames({
      'map-block': true,
      'no-quest-block': !showQuest,
    });

    const questPanelClass = classNames({
      'quest-block': true,
      'quest-hide': !showQuest,
    });

    const questButtonClass = classNames({
      'quest-button': true,
      active: minimized,
      inactive: !minimized,
    });

    return (
      <div className="quest-page">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <img className="logo" onClick={() => { browserHistory.push('/home'); }} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/logo-100.png" role="presentation" />
        <div className="logo-name-tab">
          <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/name-vertical.png" role="presentation" />
        </div>
        <QuestButton
          className={questButtonClass}
          onClick={this.questButtonClicked}
          onCloseClick={this.closeClicked}
        />
        <QuestPanel
          className={questPanelClass}
          minimizeClicked={this.minimizeClicked}
          closeClicked={this.closeClicked}
          mapViewPortChange={this.mapViewPortChange}
        />
        <MapBlock className={mapBlockClass}>
          <ReactResizeDetector handleWidth handleHeight onResize={() => { if (this.map) this.map.resize(); }} />
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
        { brochure && <Brochure name={brochure} />}
      </div>
    );
  }
}

QuestPage.propTypes = {
  recommendations: PropTypes.object,
  places: PropTypes.array,
  params: PropTypes.shape({
    brochure: PropTypes.string,
    viewport: PropTypes.string,
    types: PropTypes.string,
    descriptives: PropTypes.string,
  }),
  mapChange: PropTypes.func,
  fetchQuestInfo: PropTypes.func,
  fetchRecommendations: PropTypes.func,
  setDefaultQuest: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    mapChange: (mapInfo) => dispatch(mapChange(mapInfo)),
    fetchQuestInfo: () => dispatch(fetchQuestInfo()),
    fetchRecommendations: () => dispatch(fetchRecommendations()),
    setDefaultQuest: (data) => dispatch(setDefaultQuest(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  recommendations: makeSelectRecommendations(),
  places: makeSelectPlaces(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(QuestPage);
