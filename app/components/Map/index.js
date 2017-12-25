import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import { isEqual } from 'lodash'
import { connect } from 'react-redux'
import ReactResizeDetector from 'react-resize-detector'
import ReactMapboxGl from 'react-mapbox-gl'
import { browserHistory } from 'react-router'
import { createStructuredSelector } from 'reselect'
import {
  COLORS,
  CENTER_COORDS,
  CLOUDINARY_POINTS_URL,
  CLOUDINARY_SHAPES_URL,
  DEFAULT_ZOOM,
  MAP_ACCESS_TOKEN,
} from 'containers/App/constants'
import { getRecommendationRequest, mapChange } from 'containers/QuestPage/actions'
import { PLACE_CLICK } from 'containers/QuestPage/constants'
import { selectRecommendations, selectViewport, selectInfo } from 'containers/QuestPage/selectors'
import { selectLocale } from 'containers/LanguageProvider/selectors'
import './style.scss'

const MapBox = ReactMapboxGl({ accessToken: MAP_ACCESS_TOKEN })

class Map extends Component {
  static propTypes = {
    mapChange: PropTypes.func,
    getRecommendationRequest: PropTypes.func,
    recommendations: PropTypes.array,
    viewport: PropTypes.object,
    panelState: PropTypes.string,
    className: PropTypes.string,
    locale: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      styleLoaded: false,
    }
  }

  componentWillMount() {
    this.mapStyle = {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          url: 'mapbox://cartaguide.white',
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
    }
  }

  componentWillReceiveProps(nextProps) {
    const { info: { status }, viewport: { center, zoom } } = nextProps
    if (status === PLACE_CLICK && this.map) {
      this.map.flyTo({
        center,
        zoom,
      })
    }
    this.handleRedrawMap(nextProps)
  }

  handleElementClick = link => {
    const { pathname } = browserHistory.getCurrentLocation()
    if (pathname.indexOf('/info/') === -1) {
      browserHistory.push(`${pathname}/info/${link}`)
    }
  }

  handleZoomEnd = map => {
    const { panelState, mapChange, getRecommendationRequest } = this.props
    mapChange({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
      center: map.getCenter(),
    })

    if (panelState !== 'closed') {
      getRecommendationRequest()
    }
  }

  handleStyleLoad = map => {
    const { mapChange, viewport: { center, zoom }, getRecommendationRequest } = this.props
    this.map = map
    this.map.setZoom(zoom !== DEFAULT_ZOOM ? zoom : DEFAULT_ZOOM)
    this.map.setCenter(!isEqual(CENTER_COORDS, center) ? center : CENTER_COORDS)

    mapChange({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
      center: map.getCenter(),
    })

    this.setState({ styleLoaded: true }, getRecommendationRequest)
  }

  handleDragEnd = map => {
    const { panelState, mapChange, getRecommendationRequest } = this.props

    mapChange({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
      center: map.getCenter(),
    })

    if (panelState !== 'closed') {
      getRecommendationRequest()
    }
  }

  handleAddShapes = () => {
    this.map.addSource('shapes', {
      type: 'geojson',
      data: `${CLOUDINARY_SHAPES_URL}/shapes.geojson`,
    })

    COLORS.slice().reverse().forEach((color, index) => {
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
        this.handleElementClick(link)
      })
    })
  }

  handleAddCaption = () => {
    this.map.addSource('points', {
      type: 'geojson',
      data: `${CLOUDINARY_POINTS_URL}/points.geojson`,
    })

    COLORS.slice().reverse().forEach((color, index) => {
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
        this.handleElementClick(link)
      })
    })
  }

  handleClearMap = () => {
    if (this.map) {
      if (!this.map.getSource('shapes')) {
        this.handleAddShapes()
      }

      if (!this.map.getSource('points')) {
        this.handleAddCaption()
      }

      const sources = Array(COLORS.length).fill(0)
      sources.map((source, index) => {
        const filter = ['==', 'e', '']
        this.map.setFilter(`shape-border-offset-${index}`, filter)
        this.map.setFilter(`shape-border-${index}`, filter)
        this.map.setFilter(`shape-fill-${index}`, filter)
        this.map.setFilter(`shape-caption-${index}`, filter)
      })
    }
  }

  handleRedrawMap = props => {
    const { panelState, recommendations } = props
    this.handleClearMap()
    if (this.map) {
      // this.map.flyTo({
      //   center: props.viewport.center,
      //   zoom: props.viewport.zoom,
      // })
      if (panelState !== 'closed') {
        recommendations.map((recommendation, index) => {
          const { display, e } = recommendation
          const filter = ['==', 'e', e]
          if (display === 'shape') {
            this.map.setFilter(`shape-border-offset-${index}`, filter)
            this.map.setFilter(`shape-border-${index}`, filter)
            this.map.setFilter(`shape-fill-${index}`, filter)
            this.map.setFilter(`shape-caption-${index}`, filter)
          } else if (display === 'icon') {
            this.map.setFilter(`shape-border-offset-${index}`, ['==', 'e', ''])
            this.map.setFilter(`shape-border-${index}`, ['==', 'e', ''])
            this.map.setFilter(`shape-caption-${index}`, filter)
          }
        })
      }
    }
  }

  handleResize = () => {
    if (this.map) {
      this.map.resize()
    }
  }

  render() {
    const { panelState } = this.props
    const { styleLoaded } = this.state

    return (
      <div className={cx({ map: true, map__withoutQuest: panelState !== 'opened', hidden: !styleLoaded })}>
        <ReactResizeDetector handleWidth handleHeight onResize={this.handleResize} />
        <MapBox
          style={this.mapStyle}
          containerStyle={{ width: '100%', height: '100%' }}
          onStyleLoad={this.handleStyleLoad}
          onZoomEnd={this.handleZoomEnd}
          onDragEnd={this.handleDragEnd}
        />
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  locale: selectLocale(),
  viewport: selectViewport(),
  recommendations: selectRecommendations(),
  info: selectInfo(),
})

const actions = {
  getRecommendationRequest,
  mapChange,
}

export default connect(selectors, actions)(Map)
