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
  CLOUDINARY_POINTS_URL,
  CLOUDINARY_SHAPES_URL,
  MAP_ACCESS_TOKEN,
} from 'containers/App/constants'
import { mapChange } from 'containers/QuestPage/actions'
import {
  selectRecommendations,
  selectViewport,
  selectInfo,
} from 'containers/QuestPage/selectors'
import { selectLocale } from 'containers/LanguageProvider/selectors'
import './style.scss'

const MapBox = ReactMapboxGl({ accessToken: MAP_ACCESS_TOKEN })

class Map extends Component {
  static propTypes = {
    mapChange: PropTypes.func,
    recommendations: PropTypes.array,
    viewport: PropTypes.object,
    panelState: PropTypes.string,
    className: PropTypes.string,
    locale: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      showMap: false,
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
      layers: [
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22,
        },
      ],
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    }
  }

  componentWillReceiveProps(nextProps) {
    const { viewport } = this.props
    if (this.map && !isEqual(viewport, nextProps.viewport)) {
      const { center, zoom } = nextProps.viewport
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

  handleMapChange = map => {
    this.map = map
    const { mapChange } = this.props
    const { lng, lat } = this.map.getCenter()
    const center = [parseFloat(lng.toFixed(4)), parseFloat(lat.toFixed(4))]
    const zoom = parseFloat(this.map.getZoom().toFixed(2))

    this.map.setZoom(zoom)
    this.map.setCenter(center)

    mapChange({
      zoom,
      center,
      bounds: this.map.getBounds(),
    })
  }

  handleStyleLoad = map => {
    this.map = map
    const { viewport: { center, zoom } } = this.props

    this.map.setCenter(center)
    this.map.setZoom(zoom)

    this.setState({ showMap: true })
  }

  handleAddShapes = () => {
    this.map.addSource('shapes', {
      type: 'geojson',
      data: `${CLOUDINARY_SHAPES_URL}/shapes.geojson`,
    })

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
          this.handleElementClick(link)
        })
      })
  }

  handleAddCaption = () => {
    this.map.addSource('points', {
      type: 'geojson',
      data: `${CLOUDINARY_POINTS_URL}/points.geojson`,
    })

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
    const { showMap } = this.state
    const { panelState } = this.props

    return (
      <div
        className={cx({
          map: true,
          map__withoutQuest: panelState !== 'opened',
          map__hidden: !showMap,
        })}
      >
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={this.handleResize}
        />
        <MapBox
          style={this.mapStyle}
          containerStyle={{ width: '100%', height: '100%' }}
          onStyleLoad={this.handleStyleLoad}
          onZoomEnd={this.handleMapChange}
          onDragEnd={this.handleMapChange}
        />
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  info: selectInfo(),
  locale: selectLocale(),
  viewport: selectViewport(),
  recommendations: selectRecommendations(),
})

const actions = {
  mapChange,
}

export default connect(selectors, actions)(Map)
