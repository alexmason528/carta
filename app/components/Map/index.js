import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import ReactResizeDetector from 'react-resize-detector'
import { isEqual } from 'lodash'
import MapBox from 'mapbox-gl'
import { COLORS, S3_DATA_URL, S3_ICON_URL, MAP_ACCESS_TOKEN, RECOMMENDATION_COUNT, MIN_ZOOM, MAX_ZOOM } from 'utils/globalConstants'
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

  constructor(props) {
    super(props)
    this.state = {
      shapeLoaded: false,
      pointLoaded: false,
    }
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
    this.map.on('zoomend', this.handleMapChange)
    this.map.on('touchend', this.handleMapChange)
  }

  componentWillReceiveProps(nextProps) {
    const { viewport } = this.props

    if (!isEqual(viewport, nextProps.viewport) && this.map) {
      const { viewport: { center, zoom } } = nextProps
      this.map.jumpTo({ center, zoom })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
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
    if (!isEqual(this.state, nextState)) {
      return true
    }
    return false
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.pointLoaded && nextState.shapeLoaded) {
      this.redrawMap(nextProps)
      this.addWishlists(this.props.wishlist, nextProps.wishlist)
    }
  }

  addWishlists = (curList, nextList) => {
    curList.forEach(entry => {
      const id = `star-${entry.e}`
      if (this.map.getLayer(id)) {
        this.map.removeLayer(id)
      }
    })

    nextList.forEach(entry => {
      this.Star(entry.e)
    })
  }

  Icons = ({ id, source, layer, filter, color, textsize, textfield }) => {
    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': textsize || 10,
        'text-field': textfield || `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
        'text-offset': [0, -0.2],
        'text-anchor': 'bottom',
        'icon-image': 'pin',
        'icon-anchor': 'top',
        'icon-allow-overlap': true,
      },
    })
  }

  Roads = (source, layer, filter) => {
    const id = '-road'
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id,
      source: 'mapbox',
      'source-layer': 'road_label',
      filter,
      minzoom: 12.5,
      type: 'symbol',
      paint: {
        'text-color': '#888',
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': 10,
        'text-padding': 10,
        'text-field': `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
        'symbol-placement': 'line',
        'symbol-spacing': 500,
      },
    })
  }

  Waterways = (source, layer, filter, color) => {
    const id = `${source}-waterway`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': 15,
        'text-padding': 10,
        'text-field': `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
        'symbol-placement': 'line',
        'symbol-spacing': 500,
      },
    })
  }

  Water = (source, layer, filter, color) => {
    const id = `${source}-water`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': 15,
        'text-padding': 10,
        'text-field': `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
      },
    })
  }

  Places = (source, layer, filter, color) => {
    const id = `${source}-places`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': {
          property: 'type',
          type: 'categorical',
          stops: [
            [{ zoom: 8, value: 'city' }, 11],
            [{ zoom: 8, value: 'town' }, 8],
            [{ zoom: 8, value: 'suburb' }, 6],
            [{ zoom: 8, value: 'village' }, 6],
            [{ zoom: 8, value: 'hamlet' }, 4],
            [{ zoom: 8, value: 'neighbourhood' }, 4],
            [{ zoom: 8, value: 'residential' }, 4],
            [{ zoom: 8, value: 'island' }, 13],
            [{ zoom: 8, value: 'islet' }, 13],
            [{ zoom: 8, value: 'archipelago' }, 13],
            [{ zoom: 8, value: 'aboriginal_lands' }, 13],
            [{ zoom: 18, value: 'city' }, 31],
            [{ zoom: 18, value: 'town' }, 28],
            [{ zoom: 18, value: 'suburb' }, 26],
            [{ zoom: 18, value: 'village' }, 21],
            [{ zoom: 18, value: 'hamlet' }, 19],
            [{ zoom: 18, value: 'neighbourhood' }, 19],
            [{ zoom: 18, value: 'residential' }, 19],
            [{ zoom: 18, value: 'island' }, 13],
            [{ zoom: 18, value: 'islet' }, 13],
            [{ zoom: 18, value: 'archipelago' }, 33],
            [{ zoom: 18, value: 'aboriginal_lands' }, 13],
          ],
        },
        'text-padding': 15,
        'text-field': `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
      },
    })
  }

  Seas = (source, layer, filter, color) => {
    const id = `seas${source}`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter,
      type: 'symbol',
      'symbol-placement': 'point',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': {
          property: 'labelrank',
          type: 'exponential',
          stops: [
            [{ zoom: 1, value: 1 }, 13],
            [{ zoom: 1, value: 2 }, 10],
            [{ zoom: 1, value: 4 }, 7],
            [{ zoom: 1, value: 6 }, 5],
            [{ zoom: 21, value: 1 }, 63],
            [{ zoom: 21, value: 2 }, 60],
            [{ zoom: 21, value: 4 }, 57],
            [{ zoom: 21, value: 6 }, 54],
          ],
        },
        'text-field': `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
        'symbol-spacing': 500,
      },
    })
  }

  CurvedSeas = (source, layer, filter, color) => {
    const id = `${source}-curved-seas`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': {
          stops: [[1, 15], [21, 40]],
        },
        'text-field': `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
        'symbol-placement': 'line',
        'symbol-spacing': 1000,
      },
    })
  }

  Cities = (source, layer, filter, color) => {
    const id = `${source}-cities`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': {
          property: 'scalerank',
          type: 'exponential',
          stops: [
            [{ zoom: 1, value: 2 }, 5],
            [{ zoom: 1, value: 4 }, 3],
            [{ zoom: 1, value: 6 }, 1],
            [{ zoom: 1, value: 8 }, 0],
            [{ zoom: 1, value: 10 }, 0],
            [{ zoom: 21, value: 2 }, 45],
            [{ zoom: 21, value: 4 }, 43],
            [{ zoom: 21, value: 6 }, 41],
            [{ zoom: 21, value: 8 }, 39],
            [{ zoom: 21, value: 10 }, 37],
          ],
        },
        'text-padding': 10,
        'text-field': `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
      },
    })
  }

  States = (source, layer, filter, color) => {
    const id = `${source}-states`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': {
          stops: [[1, 8], [21, 48]],
        },
        'text-padding': 10,
        'text-field': `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
      },
    })
  }

  Metropoles = (source, layer, filter, color) => {
    const id = `${source}-metropoles`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id,
      source,
      'source-layer': layer,
      filter,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': {
          property: 'scalerank',
          type: 'exponential',
          stops: [[{ zoom: 1, value: 0 }, 7], [{ zoom: 1, value: 1 }, 5], [{ zoom: 21, value: 0 }, 47], [{ zoom: 21, value: 1 }, 45]],
        },
        'text-padding': 10,
        'text-field': `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
      },
    })
  }

  Countries = (source, layer, filter, color) => {
    const id = `${source}-countries`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id: `${source}-countries`,
      source,
      'source-layer': layer,
      filter,
      type: 'symbol',
      paint: {
        'text-color': color,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      },
      layout: {
        'text-size': {
          property: 'scalerank',
          type: 'exponential',
          stops: [
            [{ zoom: 1, value: 1 }, 14],
            [{ zoom: 1, value: 2 }, 11],
            [{ zoom: 1, value: 3 }, 8],
            [{ zoom: 1, value: 4 }, 7],
            [{ zoom: 1, value: 5 }, 5],
            [{ zoom: 1, value: 6 }, 0],
            [{ zoom: 21, value: 1 }, 54],
            [{ zoom: 21, value: 2 }, 51],
            [{ zoom: 21, value: 3 }, 48],
            [{ zoom: 21, value: 4 }, 47],
            [{ zoom: 21, value: 5 }, 45],
            [{ zoom: 21, value: 6 }, 40],
          ],
        },
        'text-padding': 10,
        'text-field': `{name${this.lang}}`,
        'text-font': ['Open Sans Light', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
      },
    })
  }

  Star = e => {
    const id = `star-${e}`
    if (this.map.getLayer(id)) return

    this.map.addLayer({
      id: `star-${e}`,
      source: 'points',
      filter: ['==', 'e', e],
      type: 'symbol',
      layout: {
        'text-size': 13,
        'text-field': '{name}',
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Bold'],
        'text-transform': 'uppercase',
        'text-anchor': 'top',
        'icon-image': 'star-15',
        'icon-size': 0.9,
        'icon-offset': [0, -2],
        'icon-anchor': 'bottom',
      },
      paint: {
        'text-color': this.black,
        'text-halo-color': 'rgba(255, 255, 255, 1)',
        'text-halo-width': 3,
        'icon-opacity': 0.5,
      },
    })

    this.map.on('mouseenter', id, () => {
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

  Pointer = name => {
    const id = `links-${name}`
    this.map.on('mouseenter', id, () => {
      this.map.getCanvas().style.cursor = 'pointer'
    })
    this.map.on('mouseleave', id, () => {
      this.map.getCanvas().style.cursor = ''
    })

    if (name === 'metropoles') {
      this.map.on('click', id, data => {
        const link = data.features[0].properties.link
        this.handlePlaceClick(link)
      })
    }
  }

  Shape = () => {
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

    this.setState({ shapeLoaded: true })
  }

  Caption = () => {
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

    this.setState({ pointLoaded: true })
  }

  clearMap = () => {
    const sources = Array(COLORS.length).fill(0)
    sources.map((source, index) => {
      const filter = ['==', 'e', '']
      this.map.setFilter(`shape-border-offset-${index}`, filter)
      this.map.setFilter(`shape-border-${index}`, filter)
      this.map.setFilter(`shape-fill-${index}`, filter)
      this.map.setFilter(`shape-caption-${index}`, filter)
    })
  }

  redrawMap = ({ panelState, recommendations }) => {
    if (recommendations.length === 0 || panelState === 'closed') {
      this.clearMap()
    } else {
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

  handleLoad = () => {
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

    if (!this.map.getSource('links')) {
      this.map.addSource('links', {
        type: 'vector',
        url: 'mapbox://cartaguide.80tjqhr1',
      })
    }

    this.map.loadImage(`${S3_ICON_URL}/star-15.png`, (err, img) => {
      if (!err && !this.map.hasImage('star-15')) {
        this.map.addImage('star-15', img)
      }
    })

    this.map.loadImage(`${S3_ICON_URL}/marker-grey-15.png`, (err, img) => {
      if (!err && !this.map.hasImage('pin')) {
        this.map.addImage('pin', img)
      }
    })

    this.map.on('mousemove', 'links', () => {
      this.map.getCanvas().style.cursor = 'pointer'
    })

    this.black = '#333'
    this.grey = '#999'
    this.light = '#bbb'
    this.lighter = '#ddd'
    this.lang = '_en'
    this.everything = ['!=', 'name', '']

    this.Icons({ id: 'poi', source: 'mapbox', layer: 'poi_label', filter: this.everything, color: '#888' })
    this.Roads('mapbox', 'road_label', this.everything, '#ccc')
    this.Waterways('mapbox', 'waterway_label', this.everything, '#ccc')
    this.Water('mapbox', 'water_label', this.everything, '#ccc')
    this.Places('mapbox', 'place_label', this.everything, { stops: [[7, '#aaa'], [8, '#888']] })
    this.Icons({ id: 'railstations', source: 'mapbox', layer: 'rail_station_label', filter: this.everything, color: '#888' })
    this.Icons({ id: 'peaks', source: 'mapbox', layer: 'mountain_peak_label', filter: this.everything, color: '#888', textfield: `{name${this.lang}} \n ({elevation_m}m)` })
    this.Icons({ id: 'airports', source: 'mapbox', layer: 'airport_label', filter: this.everything, color: '#888', textsize: { stops: [[10, 10], [20, 30]] } })
    this.Seas('mapbox', 'marine_label', ['==', 'placement', 'point'], '#ddd')
    this.CurvedSeas('mapbox', 'marine_label', ['==', 'placement', 'line'], '#ddd')
    this.Cities('mapbox', 'place_label', ['all', ['==', 'type', 'city'], ['>=', 'scalerank', 2]], { stops: [[7, '#aaa'], [8, '#888']] })
    this.Cities('links', 'place_link-abgtyj', this.everything, '#000')
    this.States('mapbox', 'state_label', this.everything, { stops: [[7, '#ccc'], [8, '#aaa']] })
    this.Metropoles('mapbox', 'place_label', ['all', ['==', 'type', 'city'], ['<=', 'scalerank', 1]], { stops: [[7, '#aaa'], [8, '#888']] })
    this.Metropoles('links', 'place_link-abgtyj', this.everything, '#000')
    this.Countries('mapbox', 'country_label', this.everything, { stops: [[7, '#aaa'], [8, '#888']] })

    this.Pointer('cities')
    this.Pointer('metropoles')

    this.Shape()
    this.Caption()
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
