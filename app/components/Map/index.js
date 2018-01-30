import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import ReactResizeDetector from 'react-resize-detector'
import { isEqual, differenceWith } from 'lodash'
import MapBox from 'mapbox-gl'
import { COLORS, S3_DATA_URL, S3_ICON_URL, MAP_ACCESS_TOKEN, RECOMMENDATION_COUNT, MIN_ZOOM, MAX_ZOOM } from 'utils/globalConstants'
import { isMobile } from 'utils/mobileDetector'
import './style.scss'

MapBox.accessToken = MAP_ACCESS_TOKEN

class Map extends Component {
  static propTypes = {
    mapChange: PropTypes.func,
    onClick: PropTypes.func,
    updateBrochureLink: PropTypes.func,
    recommendations: PropTypes.array,
    viewport: PropTypes.object,
    params: PropTypes.object,
    router: PropTypes.object,
    wishlist: PropTypes.array,
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
        },
      ],
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    }

    this.map = new MapBox.Map({
      container: 'map',
      style: this.mapStyle,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      attributionControl: false,
    })

    this.map.on('load', this.handleLoad)
    this.map.on('dragend', this.handleMapChange)
    if (isMobile()) {
      this.map.on('touchend', this.handleMapChange)
    }
    this.map.on('zoomend', this.handleMapChange)
  }

  componentWillReceiveProps(nextProps) {
    const { viewport, wishlist } = this.props

    if (!isEqual(viewport, nextProps.viewport) && this.map) {
      const { viewport: { center, zoom } } = nextProps
      this.map.jumpTo({ center, zoom })
    }

    if (this.map) {
      this.handleRedrawMap(nextProps)
    }

    if (wishlist.length - nextProps.wishlist.length > 0) {
      this.handleDeleteWishlistLayers(wishlist, nextProps.wishlist)
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
    if (!isEqual(this.props.wishlist, nextProps.wishlist)) {
      return true
    }
    return false
  }

  handleDeleteWishlistLayers = (curList, nextList) => {
    const diff = differenceWith(curList, nextList, isEqual)

    diff.forEach(entry => {
      this.map.removeLayer(`pin-${entry.e}`)
      this.map.removeLayer(`pin-and-label-${entry.e}`)
    })
  }

  handleLoad = () => {
    const { wishlist } = this.props

    if (!this.map.getSource('mapbox')) {
      this.map.addSource('mapbox', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-streets-v7',
      })
    }

    if (!this.map.getSource('shapes')) {
      this.map.addSource('shapes', {
        type: 'geojson',
        data: `${S3_DATA_URL}/shapes.geojson`,
      })
    }

    if (!this.map.getSource('points')) {
      this.map.addSource('points', {
        type: 'geojson',
        data: `${S3_DATA_URL}/points.geojson`,
      })
    }

    this.map.loadImage(`${S3_ICON_URL}/marker-red-15.png`, (err, img) => {
      if (!err && !this.map.hasImage('marker')) {
        this.map.addImage('marker', img)
      }
    })

    this.map.loadImage(`${S3_ICON_URL}/star-red.png`, (err, img) => {
      if (!err && !this.map.hasImage('star')) {
        this.map.addImage('star', img)
      }
    })

    this.map.on('mousemove', 'links', () => {
      this.map.getCanvas().style.cursor = 'pointer'
    })

    const zoom = this.map.getZoom()
    const dark = '#444'
    const grey = '#888'
    const light = '#ddd'

    this.handleLoadLayer('road-name', 'mapbox', 'road_label', '!=', 'name', '', 0, 18, grey, 10, 0, 'line', 0, 'center', '')
    this.handleLoadLayer('road-ref', 'mapbox', 'road_label', '!=', 'name', '', 0, 18, grey, 11, 0, 'line', 0, 'center', '')
    this.map.setLayoutProperty('road-ref', 'text-field', '{ref}')
    this.handleLoadLayer('waterway', 'mapbox', 'waterway_label', '!=', 'name', '', 0, 18, light, 15, 0, 'line', 0, 'center', '')
    this.handleLoadLayer('water', 'mapbox', 'water_label', '!=', 'name', '', 0, 18, light, 15, 0, 'point', 0, 'center', '')
    this.handleLoadLayer('poi', 'mapbox', 'poi_label', '!=', 'name', '', 0, 18, dark, 10, 0, 'point', -1.5, 'bottom', 'marker')
    this.handleLoadLayer('railstations', 'mapbox', 'rail_station_label', '!=', 'name', '', 0, 18, dark, 10, 0, 'point', -1.5, 'bottom', 'marker')
    this.handleLoadLayer('peaks', 'mapbox', 'mountain_peak_label', '!=', 'name', '', 0, 18, dark, 10, 0, 'point', -1.5, 'bottom', 'marker')
    this.map.setLayoutProperty('peaks', 'text-field', '{name_en} \n ({elevation_m}m)')
    this.handleLoadLayer('seas', 'mapbox', 'marine_label', '==', 'placement', 'point', 0, 18, light, 7 + zoom * 3, 0, 'point', 0, 'center', '')
    this.handleLoadLayer('curved-seas', 'mapbox', 'marine_label', '==', 'placement', 'line', 0, 18, light, 7 + zoom * 3, 0, 'line', 0, 'center', '')
    this.handleLoadLayer('oceans', 'mapbox', 'marine_label', '==', 'labelrank', 1, 0, 18, light, 10 + zoom * 3, 0, 'point', 0, 'center', '')
    this.handleLoadLayer('villages', 'mapbox', 'place_label', '==', 'type', 'village', 0, 18, dark, -6 + zoom * 1.5, 30, 'point', 0, 'center', '')
    this.handleLoadLayer('residentials', 'mapbox', 'place_label', '==', 'type', 'residential', 0, 18, dark, -6 + zoom * 1.5, 30, 'point', 0, 'center', '')
    this.handleLoadLayer('suburbs', 'mapbox', 'place_label', '==', 'type', 'suburb', 0, 18, dark, -10 + zoom * 2, 30, 'point', 0, 'center', '')
    this.handleLoadLayer('towns', 'mapbox', 'place_label', '==', 'type', 'town', 8, 18, dark, -8 + zoom * 2, 30, 'point', 0, 'center', '')
    this.handleLoadLayer('airports', 'mapbox', 'airport_label', '==', 'scalerank', 1, 0, 18, dark, 12, 0, 'point', -1.3, 'bottom', 'marker')
    this.handleLoadLayer('cities', 'mapbox', 'place_label', '==', 'type', 'city', 6, 18, dark, -4 + zoom * 2, 0, 'point', 0, 'center', '')
    this.handleLoadLayer('places-6', 'mapbox', 'place_label', '>=', 'scalerank', 5, 6, 10, dark, -3 + zoom * 2, 0, 'point', 0, 'center', '')
    this.handleLoadLayer('places-4', 'mapbox', 'place_label', '<=', 'scalerank', 4, 5, 10, dark, 2 + zoom * 2, 0, 'point', 0, 'center', '')
    this.handleLoadLayer('states', 'mapbox', 'state_label', '!=', 'name', '', 0, 18, '#bbb', 6 + zoom * 2, 10, 'point', 0, 'center', '')
    this.handleLoadLayer('places-1', 'mapbox', 'place_label', '<=', 'scalerank', 1, 0, 18, dark, 5 + zoom * 2, 0, 'point', 0, 'center', '')
    this.handleLoadLayer('countries-6', 'mapbox', 'country_label', '==', 'scalerank', 6, 0, 18, dark, -2 + zoom * 2, 10, 'point', 0, 'center', '')
    this.handleLoadLayer('countries-5', 'mapbox', 'country_label', '==', 'scalerank', 5, 0, 18, dark, 3 + zoom * 2, 10, 'point', 0, 'center', '')
    this.handleLoadLayer('countries-4', 'mapbox', 'country_label', '==', 'scalerank', 4, 0, 18, dark, 5 + zoom * 2, 10, 'point', 0, 'center', '')
    this.handleLoadLayer('countries-3', 'mapbox', 'country_label', '==', 'scalerank', 3, 0, 18, dark, 6 + zoom * 2, 10, 'point', 0, 'center', '')
    this.handleLoadLayer('countries-2', 'mapbox', 'country_label', '==', 'scalerank', 2, 0, 18, dark, 9 + zoom * 2, 10, 'point', 0, 'center', '')
    this.handleLoadLayer('countries-1', 'mapbox', 'country_label', '==', 'scalerank', 1, 0, 18, dark, 12 + zoom * 2, 10, 'point', 0, 'center', '')

    wishlist.forEach(entry => {
      this.handleLoadStar(entry.e)
      this.handleLoadStarAndLabel(entry.e)
    })

    this.handleLoadShape()
    this.handleLoadCaption()
  }

  handleLoadLayer = (id, source, layer, filterType, filterField, filterVal, minzoom, maxzoom, color, size, padding, placement, offset, anchor, image) => {
    const lang = '_en'
    if (this.map.getLayer(id)) return
    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter: [filterType, filterField, filterVal],
      minzoom,
      maxzoom,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': size > 0 ? size : 0,
        'text-padding': padding,
        'text-field': `{name${lang}}`,
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
        'symbol-placement': placement,
        'symbol-spacing': 1000,
        'text-offset': [0, offset],
        'text-anchor': anchor,
        'icon-image': image,
        'icon-offset': [0, -13.5],
        'icon-anchor': 'top',
      },
    })
  }

  handleLoadStar = e => {
    const img = 'star'
    const id = `pin-${e}`
    if (this.map.getLayer(id)) return
    this.map.addLayer({
      id,
      source: 'points',
      filter: ['==', 'e', e],
      type: 'symbol',
      layout: {
        'icon-image': img,
        'icon-size': 0.3,
        'icon-offset': [0, -45],
        'icon-anchor': 'bottom',
      },
    })

    this.map.on('mousemove', id, () => {
      this.map.getCanvas().style.cursor = 'pointer'
    })

    this.map.on('mouseleave', id, () => {
      this.map.getCanvas().style.cursor = ''
    })

    this.map.on('click', id, data => {
      const link = data.features[0].properties.link
      this.handlePlaceClick(link)
    })
  }

  handleLoadStarAndLabel = e => {
    const img = 'star'
    const black = '#000'
    const id = `pin-and-label-${e}`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id,
      source: 'points',
      filter: ['==', 'e', e],
      type: 'symbol',
      layout: {
        'text-size': 13,
        'text-field': '{name}',
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
        'text-offset': [0, -0.7],
        'text-anchor': 'top',
        'icon-image': img,
        'icon-size': 0.3,
        'icon-offset': [0, -45],
        'icon-anchor': 'bottom',
      },
      paint: {
        'text-color': black,
        'text-halo-color': 'rgba(255, 255, 255, 1)',
        'text-halo-width': 3,
      },
    })

    this.map.on('mousemove', id, () => {
      this.map.getCanvas().style.cursor = 'pointer'
    })

    this.map.on('mouseleave', id, () => {
      this.map.getCanvas().style.cursor = ''
    })

    this.map.on('click', id, data => {
      const link = data.features[0].properties.link
      this.handlePlaceClick(link)
    })
  }

  handleLoadShape = () => {
    COLORS.slice()
      .reverse()
      .forEach((color, index) => {
        const id = `shape-fill-${index}`
        if (this.map.getLayer(id)) return

        this.map.addLayer({
          id,
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
        const id = `shape-caption-${index}`
        if (this.map.getLayer(id)) return
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
    this.handleLoad()

    const sources = Array(COLORS.length).fill(0)
    sources.map((source, index) => {
      const filter = ['==', 'e', '']
      this.map.setFilter(`shape-border-offset-${index}`, filter)
      this.map.setFilter(`shape-border-${index}`, filter)
      this.map.setFilter(`shape-fill-${index}`, filter)
      this.map.setFilter(`shape-caption-${index}`, filter)
    })
  }

  handleRedrawMap = ({ panelState, recommendations }) => {
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

  handleMapChange = evt => {
    if (evt.type === 'zoomend' && evt.originalEvent && evt.originalEvent.type !== 'wheel') return

    const { mapChange, panelState } = this.props

    const zoom = this.map.getZoom()
    const { lng, lat } = this.map.getCenter()
    const bounds = this.map.getBounds()
    let param = {
      zoom: parseFloat(zoom.toFixed(2)),
      center: {
        lng: parseFloat(lng.toFixed(6)),
        lat: parseFloat(lat.toFixed(6)),
      },
    }

    if (panelState === 'minimized') {
      param.bounds = bounds
    } else {
      const { _ne, _sw } = bounds
      const ratio = window.innerWidth / 256

      param.bounds = {
        _ne,
        _sw: { lng: _sw.lng + (_ne.lng - _sw.lng) / ratio, lat: _sw.lat },
      }
    }

    mapChange(param)

    this.handleChangeTextSize()
  }

  handleChangeTextSize = () => {
    const zoom = this.map.getZoom()

    if (this.map.getLayer('seas')) {
      this.map.setLayoutProperty('seas', 'text-size', 9 + zoom * 2)
    }
    if (this.map.getLayer('curved-seas')) {
      this.map.setLayoutProperty('curved-seas', 'text-size', 9 + zoom * 2)
    }
    if (this.map.getLayer('oceans')) {
      this.map.setLayoutProperty('oceans', 'text-size', 10 + zoom * 3)
    }
    if (this.map.getLayer('villages')) {
      this.map.setLayoutProperty('villages', 'text-size', zoom >= 4 ? -6 + zoom * 1.5 : 0)
    }
    if (this.map.getLayer('residentials')) {
      this.map.setLayoutProperty('residentials', 'text-size', zoom >= 4 ? -6 + zoom * 1.5 : 0)
    }
    if (this.map.getLayer('suburbs')) {
      this.map.setLayoutProperty('suburbs', 'text-size', zoom >= 5 ? -10 + zoom * 2 : 0)
    }
    if (this.map.getLayer('towns')) {
      this.map.setLayoutProperty('towns', 'text-size', zoom >= 4 ? -8 + zoom * 2 : 0)
    }
    if (this.map.getLayer('cities')) {
      this.map.setLayoutProperty('cities', 'text-size', zoom >= 2 ? -4 + zoom * 2 : 0)
    }
    if (this.map.getLayer('places-6')) {
      this.map.setLayoutProperty('places-6', 'text-size', zoom >= 1.5 ? -3 + zoom * 2 : 0)
    }
    if (this.map.getLayer('places-4')) {
      this.map.setLayoutProperty('places-4', 'text-size', 2 + zoom * 2)
    }
    if (this.map.getLayer('places-1')) {
      this.map.setLayoutProperty('places-1', 'text-size', 5 + zoom * 2)
    }
    if (this.map.getLayer('states')) {
      this.map.setLayoutProperty('states', 'text-size', 6 + zoom * 2)
    }
    if (this.map.getLayer('countries-6')) {
      this.map.setLayoutProperty('countries-6', 'text-size', zoom >= 1 ? -2 + zoom * 2 : 0)
    }
    if (this.map.getLayer('countries-5')) {
      this.map.setLayoutProperty('countries-5', 'text-size', 3 + zoom * 2)
    }
    if (this.map.getLayer('countries-4')) {
      this.map.setLayoutProperty('countries-4', 'text-size', 5 + zoom * 2)
    }
    if (this.map.getLayer('countries-3')) {
      this.map.setLayoutProperty('countries-3', 'text-size', 6 + zoom * 2)
    }
    if (this.map.getLayer('countries-2')) {
      this.map.setLayoutProperty('countries-2', 'text-size', 9 + zoom * 2)
    }
    if (this.map.getLayer('countries-1')) {
      this.map.setLayoutProperty('countries-1', 'text-size', 12 + zoom * 2)
    }
  }

  handlePlaceClick = place => {
    const { params: { viewport, types, descriptives }, router, updateBrochureLink } = this.props
    const url = viewport && types && descriptives ? `/quest/in/${place}/${viewport}/${types}/${descriptives}` : `/quest/in/${place}`
    router.push(url)
    updateBrochureLink(place)
  }

  handleResize = () => {
    if (this.map) {
      this.map.resize()
    }
  }

  render() {
    const { onClick } = this.props

    return (
      <div id="map" className="map" onClick={onClick}>
        <ReactResizeDetector handleWidth handleHeight onResize={this.handleResize} />
      </div>
    )
  }
}

export default withRouter(Map)
