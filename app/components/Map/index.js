import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import ReactResizeDetector from 'react-resize-detector'
import cx from 'classnames'
import { isEqual } from 'lodash'
import MapBox from 'mapbox-gl'
import { COLORS, S3_DATA_URL, S3_ICON_URL, MAP_ACCESS_TOKEN, RECOMMENDATION_COUNT } from 'utils/globalConstants'
import './style.scss'

MapBox.accessToken = MAP_ACCESS_TOKEN

class Map extends Component {
  static propTypes = {
    mapChange: PropTypes.func,
    onClick: PropTypes.func,
    recommendations: PropTypes.array,
    viewport: PropTypes.object,
    params: PropTypes.object,
    router: PropTypes.object,
    panelState: PropTypes.string,
    className: PropTypes.string,
    locale: PropTypes.string,
  }

  componentDidMount() {
    const { center, zoom } = this.props.viewport

    this.mapStyle = {
      version: 8,
      center: [center.lng, center.lat],
      zoom,
      sources: {
        cartaSource: {
          type: 'raster',
          url: 'mapbox://cartaguide.white',
          tileSize: 128,
        },
      },
      layers: [
        {
          id: 'cartaSourceTiles',
          type: 'raster',
          source: 'cartaSource',
          minzoom: 0,
          maxzoom: 22,
        },
      ],
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    }

    this.map = new MapBox.Map({
      container: 'map',
      style: this.mapStyle,
      attributionControl: false,
    })

    this.map.on('load', this.handleLoad)
    this.map.on('moveend', this.handleMapChange)
    this.map.on('zoomend', this.handleMapChange)
  }

  componentWillReceiveProps(nextProps) {
    const { viewport } = this.props
    if (!isEqual(viewport, nextProps.viewport) && this.map) {
      this.map.jumpTo({ center: nextProps.viewport.center, zoom: nextProps.viewport.zoom })
    }
    if (this.map) {
      this.handleRedrawMap(nextProps)
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.panelState !== nextProps.panelState) {
      return true
    }
    if (!isEqual(this.props.viewport, nextProps.viewport)) {
      return true
    }
    if (!isEqual(this.props.recommendations, nextProps.recommendations)) {
      return true
    }
    return false
  }

  handleLoad = () => {
    this.map.addSource('mapbox', {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-streets-v7',
    })

    this.map.addSource('shapes', {
      type: 'geojson',
      data: `${S3_DATA_URL}/shapes.geojson`,
    })

    this.map.addSource('points', {
      type: 'geojson',
      data: `${S3_DATA_URL}/points.geojson`,
    })

    this.map.loadImage(`${S3_ICON_URL}/marker-red.png`, (err, img) => {
      if (!err) {
        this.map.addImage('marker', img)
      }
    })

    this.map.on('mousemove', 'links', () => {
      this.map.getCanvas().style.cursor = 'pointer'
    })

    const dark = '#444'
    const grey = '#888'
    const light = '#ddd'
    const zoom = this.map.getZoom()

    this.handleLoadLabel('road-name', 'mapbox', 'road_label', '!=', 'name', '', 0, 22, grey, 10, 0, 'line')
    this.handleLoadLabel('road-ref', 'mapbox', 'road_label', '!=', 'ref', '', 0, 22, grey, 11, 0, 'line')
    this.map.setLayoutProperty('road-ref', 'text-field', '{ref}')
    this.handleLoadLabel('waterway', 'mapbox', 'waterway_label', '!=', 'name', '', 0, 22, light, 15, 0, 'line')
    this.handleLoadLabel('water', 'mapbox', 'water_label', '!=', 'name', '', 0, 22, light, 15, 0, 'point')
    this.handleLoadSymbol('poi', 'mapbox', 'poi_label', '!=', 'name', '', 0, 22, dark, 10, 0, -0.8, 'marker', 0.5, -12)
    this.handleLoadSymbol('railstations', 'mapbox', 'rail_station_label', '!=', 'name', '', 0, 22, dark, 10, 0, -0.8, 'marker', 0.5, -12)
    this.handleLoadSymbol('peaks', 'mapbox', 'mountain_peak_label', '!=', 'name', '', 0, 22, dark, 10, 0, -0.8, 'marker', 0.5, -12)
    this.map.setLayoutProperty('peaks', 'text-field', '{name_en} \n ({elevation_m}m)')
    this.handleLoadLabel('seas', 'mapbox', 'marine_label', '==', 'placement', 'point', 0, 22, light, 7 + zoom * 3, 0, 'point')
    this.handleLoadLabel('curved-seas', 'mapbox', 'marine_label', '==', 'placement', 'line', 0, 22, light, 7 + zoom * 3, 0, 'line')
    this.handleLoadLabel('oceans', 'mapbox', 'marine_label', '==', 'labelrank', 1, 0, 22, light, 10 + zoom * 3, 0, 'point')
    this.handleLoadLabel('villages', 'mapbox', 'place_label', '==', 'type', 'village', 0, 22, dark, -6 + zoom * 1.5, 30, 'point')
    this.handleLoadLabel('residentials', 'mapbox', 'place_label', '==', 'type', 'residential', 0, 22, dark, -6 + zoom * 1.5, 30, 'point')
    this.handleLoadLabel('suburbs', 'mapbox', 'place_label', '==', 'type', 'suburb', 0, 22, dark, -10 + zoom * 2, 30, 'point')
    this.handleLoadLabel('towns', 'mapbox', 'place_label', '==', 'type', 'town', 8, 22, dark, -8 + zoom * 2, 30, 'point')
    this.handleLoadSymbol('airports', 'mapbox', 'airport_label', '==', 'scalerank', 1, 0, 22, dark, 12, 0, -0.8, 'marker', 0.5, -12)
    this.handleLoadLabel('cities', 'mapbox', 'place_label', '==', 'type', 'city', 6, 22, dark, -4 + zoom * 2, 0, 'point')
    this.handleLoadLabel('places-6', 'mapbox', 'place_label', '>=', 'scalerank', 5, 6, 10, dark, -3 + zoom * 2, 0, 'point')
    this.handleLoadLabel('places-4', 'mapbox', 'place_label', '<=', 'scalerank', 4, 5, 10, dark, 2 + zoom * 2, 0, 'point')
    this.handleLoadLabel('states', 'mapbox', 'state_label', '!=', 'name', '', 0, 22, '#bbb', 6 + zoom * 2, 10, 'point')
    this.handleLoadLabel('places-1', 'mapbox', 'place_label', '<=', 'scalerank', 1, 0, 22, dark, 5 + zoom * 2, 0, 'point')
    this.handleLoadLabel('countries-6', 'mapbox', 'country_label', '==', 'scalerank', 6, 0, 22, dark, -2 + zoom * 2, 10, 'point')
    this.handleLoadLabel('countries-5', 'mapbox', 'country_label', '==', 'scalerank', 5, 0, 22, dark, 3 + zoom * 2, 10, 'point')
    this.handleLoadLabel('countries-4', 'mapbox', 'country_label', '==', 'scalerank', 4, 0, 22, dark, 5 + zoom * 2, 10, 'point')
    this.handleLoadLabel('countries-3', 'mapbox', 'country_label', '==', 'scalerank', 3, 0, 22, dark, 6 + zoom * 2, 10, 'point')
    this.handleLoadLabel('countries-2', 'mapbox', 'country_label', '==', 'scalerank', 2, 0, 22, dark, 9 + zoom * 2, 10, 'point')
    this.handleLoadLabel('countries-1', 'mapbox', 'country_label', '==', 'scalerank', 1, 0, 22, dark, 12 + zoom * 2, 10, 'point')

    this.handleLoadShape()
    this.handleLoadCaption()
  }

  handleLoadLabel = (id, source, layer, filterType, filterField, filterValue, minzoom, maxzoom, color, size, padding, placement) => {
    const lang = '_en'
    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter: [filterType, filterField, filterValue],
      minzoom,
      maxzoom,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': size,
        'text-padding': padding,
        'text-field': `{name${lang}}`,
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
        'symbol-placement': placement,
        'symbol-spacing': 1000,
      },
    })
  }

  handleLoadSymbol = (
    id,
    source,
    layer,
    filterType,
    filterField,
    filterValue,
    minzoom,
    maxzoom,
    color,
    size,
    padding,
    textOffset,
    image,
    iconSize,
    iconOffset
  ) => {
    const lang = '_en'
    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter: [filterType, filterField, filterValue],
      minzoom,
      maxzoom,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': size,
        'text-padding': padding,
        'text-field': `{name${lang}}`,
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
        'text-offset': [0, textOffset],
        'text-anchor': 'bottom',
        'icon-image': image,
        'icon-size': iconSize,
        'icon-offset': [0, iconOffset],
        'icon-anchor': 'top',
      },
    })
  }

  handleLoadShape = () => {
    COLORS.slice()
      .reverse()
      .forEach((color, index) => {
        this.map.addLayer({
          id: `shape-fill-${index}`,
          type: 'fill',
          source: 'shapes',
          layout: {},
          paint: { 'fill-color': color, 'fill-opacity': 0 },
          filter: ['==', 'e', ''],
        })

        this.map.addLayer({
          id: `shape-border-offset-${index}`,
          type: 'line',
          source: 'shapes',
          layout: {},
          paint: {
            'line-color': color,
            'line-width': 2.5,
            'line-opacity': 0.15,
            'line-offset': 1.5,
          },
          filter: ['==', 'e', ''],
        })

        this.map.addLayer({
          id: `shape-border-${index}`,
          type: 'line',
          source: 'shapes',
          layout: {},
          paint: { 'line-color': color, 'line-width': 0.5 },
          filter: ['==', 'e', ''],
        })

        const shapeFill = `shape-fill-${index}`

        this.map.on('mousemove', shapeFill, () => {
          this.map.getCanvas().style.cursor = 'pointer'
        })

        this.map.on('mouseleave', shapeFill, () => {
          this.map.getCanvas().style.cursor = ''
        })

        this.map.on('click', shapeFill, data => {
          const link = data.features[0].properties.link
          this.handlePlaceClick(link)
        })
      })
  }

  handleLoadCaption = () => {
    COLORS.slice()
      .reverse()
      .forEach((color, index) => {
        this.map.addLayer({
          id: `shape-caption-${index}`,
          type: 'symbol',
          source: 'points',
          layout: {
            'text-field': '{name}',
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 13,
            'text-transform': 'uppercase',
          },
          paint: {
            'text-color': color,
            'text-halo-width': 2,
            'text-halo-color': '#fff',
          },
          filter: ['==', 'e', ''],
        })

        const shapeCaption = `shape-caption-${index}`

        this.map.on('mousemove', shapeCaption, () => {
          this.map.getCanvas().style.cursor = 'pointer'
        })

        this.map.on('mouseleave', shapeCaption, () => {
          this.map.getCanvas().style.cursor = ''
        })

        this.map.on('click', shapeCaption, data => {
          const link = data.features[0].properties.link
          this.handlePlaceClick(link)
        })
      })
  }

  handleClearMap = () => {
    const sources = Array(COLORS.length).fill(0)
    sources.map((source, index) => {
      const filter = ['==', 'e', '']
      this.map.setFilter(`shape-border-offset-${index}`, filter)
      this.map.setFilter(`shape-border-${index}`, filter)
      this.map.setFilter(`shape-fill-${index}`, filter)
      this.map.setFilter(`shape-caption-${index}`, filter)
    })
  }

  handleRedrawMap = props => {
    const { panelState, recommendations } = props
    if (!this.map.getSource('shapes') || !this.map.getSource('points')) {
      return
    }
    this.handleClearMap()
    if (panelState !== 'closed') {
      recommendations.map((recommendation, index) => {
        const { display, e } = recommendation
        const filter = ['==', 'e', e]
        if (display === 'shape') {
          this.map.setFilter(`shape-border-offset-${RECOMMENDATION_COUNT - index - 1}`, filter)
          this.map.setFilter(`shape-border-${RECOMMENDATION_COUNT - index - 1}`, filter)
          this.map.setFilter(`shape-fill-${RECOMMENDATION_COUNT - index - 1}`, filter)
          this.map.setFilter(`shape-caption-${RECOMMENDATION_COUNT - index - 1}`, filter)
        } else if (display === 'icon') {
          this.map.setFilter(`shape-border-offset-${RECOMMENDATION_COUNT - index - 1}`, ['==', 'e', ''])
          this.map.setFilter(`shape-border-${RECOMMENDATION_COUNT - index - 1}`, ['==', 'e', ''])
          this.map.setFilter(`shape-caption-${4 - index}`, filter)
        }
      })
    }
  }

  handleMapChange = () => {
    const { mapChange } = this.props
    const zoom = this.map.getZoom()
    const { lng, lat } = this.map.getCenter()

    mapChange({
      zoom: parseFloat(zoom.toFixed(2)),
      center: {
        lng: parseFloat(lng.toFixed(4)),
        lat: parseFloat(lat.toFixed(4)),
      },
      bounds: this.map.getBounds(),
    })

    if (this.map.getLayer('seas')) {
      this.map.setLayoutProperty('seas', 'text-size', 9 + zoom * 2)
      this.map.setLayoutProperty('curved-seas', 'text-size', 9 + zoom * 2)
      this.map.setLayoutProperty('oceans', 'text-size', 10 + zoom * 3)
      this.map.setLayoutProperty('villages', 'text-size', -6 + zoom * 1.5)
      this.map.setLayoutProperty('residentials', 'text-size', -6 + zoom * 1.5)
      this.map.setLayoutProperty('suburbs', 'text-size', -10 + zoom * 2)
      this.map.setLayoutProperty('towns', 'text-size', -8 + zoom * 2)
      this.map.setLayoutProperty('cities', 'text-size', -4 + zoom * 2)
      this.map.setLayoutProperty('places-6', 'text-size', -3 + zoom * 2)
      this.map.setLayoutProperty('places-4', 'text-size', 2 + zoom * 2)
      this.map.setLayoutProperty('places-1', 'text-size', 5 + zoom * 2)
      this.map.setLayoutProperty('states', 'text-size', 6 + zoom * 2)
      this.map.setLayoutProperty('countries-6', 'text-size', -2 + zoom * 2)
      this.map.setLayoutProperty('countries-5', 'text-size', 3 + zoom * 2)
      this.map.setLayoutProperty('countries-4', 'text-size', 5 + zoom * 2)
      this.map.setLayoutProperty('countries-3', 'text-size', 6 + zoom * 2)
      this.map.setLayoutProperty('countries-2', 'text-size', 9 + zoom * 2)
      this.map.setLayoutProperty('countries-1', 'text-size', 12 + zoom * 2)
    }
  }

  handlePlaceClick = place => {
    const { params: { viewport, types, descriptives }, router } = this.props
    const url = viewport && types && descriptives ? `/quest/in/${place}/${viewport}/${types}/${descriptives}` : '/quest'
    router.push(url)
  }

  handleResize = () => {
    if (this.map) {
      this.map.resize()
    }
  }

  render() {
    const { panelState, params: { brochure }, onClick } = this.props

    return (
      <div
        id="map"
        className={cx({
          map: true,
          map__withoutQuest: panelState !== 'opened' || brochure,
        })}
        onClick={onClick}
      >
        <ReactResizeDetector handleWidth handleHeight onResize={this.handleResize} />
      </div>
    )
  }
}

export default withRouter(Map)
