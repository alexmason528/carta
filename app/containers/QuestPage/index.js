import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import ReactMapboxGl from 'react-mapbox-gl'
import classNames from 'classnames'
import ReactResizeDetector from 'react-resize-detector'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container } from 'reactstrap'
import Menu from 'components/Menu'
import { MAP_ACCESS_TOKEN, CLOUDINARY_POINTS_URL, CLOUDINARY_SHAPES_URL } from 'containers/App/constants'
import { MapBlock, ScoreBoardBlock } from 'components/Blocks'
import QuestPanel from 'components/QuestPanel'
import Brochure from 'components/Brochure'
import { Button, QuestButton } from 'components/Buttons'
import URLParser from 'utils/questURLparser'
import { mapChange, fetchQuestInfo, fetchRecommendations, setDefaultQuest } from './actions'
import { selectRecommendations, selectPlaces } from './selectors'


const Map = ReactMapboxGl({ accessToken: MAP_ACCESS_TOKEN })

class QuestPage extends Component {
  static propTypes = {
    recommendations: PropTypes.array,
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
  }

  constructor(props) {
    super(props)

    this.state = {
      showQuest: true,
      minimized: false,
      closed: false,
    }
  }

  componentWillMount() {
    // const { params: { viewport, types, descriptives }, setDefaultQuest, fetchRecommendations } = this.props

    // if (viewport && types && descriptives) {
    //   const res = URLParser({ viewport, types, descriptives })

    //   if (!res.error) {
    //     setDefaultQuest(res.data)
    //     fetchRecommendations()
    //   }
    // }

    const { fetchQuestInfo } = this.props

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

    this.containerStyle = {
      width: '100%',
      height: '100%',
    }

    this.center = [5.822, 52.142]
    this.zoom = [6]

    fetchQuestInfo()

    this.colors = ['#dd0008', '#ed7000', '#009985', '#29549a', '#8f1379']

    this.shapesGeoJSONSource = `${CLOUDINARY_SHAPES_URL}/shapes.geojson`
    this.pointsGeoJSONSource = `${CLOUDINARY_POINTS_URL}/points.geojson`

    this.map = ''

    this.count = 5

    this.handleRedrawMap(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.handleRedrawMap(nextProps)
  }

  handleZoomEnd = map => {
    const { mapChange, fetchRecommendations } = this.props
    const { showQuest, minimized, closed } = this.state

    mapChange({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
    })

    if (showQuest || minimized) {
      fetchRecommendations()
    }
  }

  handleStyleLoad = map => {
    const { mapChange, fetchRecommendations } = this.props
    mapChange({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
    })

    fetchRecommendations()
    this.map = map

    map.addSource('shapes', {
      type: 'geojson',
      data: this.shapesGeoJSONSource,
    })

    map.addSource('points', {
      type: 'geojson',
      data: this.pointsGeoJSONSource,
    })

    this.handleAddShapes(map)
    this.handleAddCaptions(map)
  }

  handleDragEnd = map => {
    const { mapChange, fetchRecommendations } = this.props
    mapChange({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
    })

    const { showQuest, minimized, closed } = this.state

    if (showQuest || minimized) {
      fetchRecommendations()
    }
  }

  handleAddShapes = map => {
    for (let i = this.count - 1; i >= 0; i -= 1) {
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
      })

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
      })

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
      })

      const shapeFill = `shape-fill-${i}`

      map.on('mousemove', shapeFill, () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', shapeFill, () => {
        map.getCanvas().style.cursor = ''
      })

      map.on('click', shapeFill, data => {
        const name = data.features[0].properties.name
        this.handleElementClick(name)
      })
    }
  }

  handleAddCaptions = map => {
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
      })

      const shapeCaption = `shape-caption-${i}`

      map.on('mousemove', shapeCaption, () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', shapeCaption, () => {
        map.getCanvas().style.cursor = ''
      })

      map.on('click', shapeCaption, data => {
        const name = data.features[0].properties.name
        this.handleElementClick(name)
      })
    }
  }

  handleRedrawMap = props => {
    if (this.map) {
      this.handleClearMap()

      props.recommendations.map((recommendation, index) => {
        const { display, e } = recommendation
        let filter = ['==', 'e', e]

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

  handleClearMap = () => {
    const { recommendations } = this.props
    recommendations.map((recommendation, index) => {
      let filter = ['==', 'e', '']

      this.map.setFilter(`shape-border-offset-${index}`, filter)
      this.map.setFilter(`shape-border-${index}`, filter)
      this.map.setFilter(`shape-fill-${index}`, filter)
      this.map.setFilter(`shape-caption-${index}`, filter)
    })
  }

  handleMapViewportChange = placeName => {
    const { places } = this.props

    for (let place of places) {
      if (place.name === placeName) {
        const { x, y, zoom } = place
        this.map.flyTo({
          center: [x, y],
          zoom: zoom,
        })
      }
    }
  }

  handleElementClick = name => {
    browserHistory.push(`/quest/i/${name}`)
  }

  handleQuestButtonClick = () => {
    this.setState({
      showQuest: !this.state.showQuest,
      minimized: false,
      closed: false,
    })

    this.handleRedrawMap(this.props)
  }

  handleMimimizeClick = () => {
    this.setState({
      showQuest: false,
      minimized: true,
      closed: false,
    })
  }

  handleCloseClick = () => {
    this.setState({
      showQuest: false,
      minimized: false,
      closed: true,
    })

    if (this.map) {
      this.handleClearMap()
    }
  }

  render() {
    const { showQuest, minimized, closed } = this.state
    const { recommendations, params: { brochure } } = this.props

    const mapBlockClass = classNames({
      'map-block': true,
      'no-quest-block': !showQuest,
    })

    const questPanelClass = classNames({
      'quest-block': true,
      'quest-hide': !showQuest,
    })

    const questButtonClass = classNames({
      'quest-button': true,
      active: minimized,
      inactive: !minimized,
    })

    return (
      <Container fluid className="questpage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <Menu currentPage="Quest" />
        <QuestButton
          className={questButtonClass}
          onClick={this.handleQuestButtonClick}
          onCloseClick={this.handleCloseClick}
        />
        <QuestPanel
          className={questPanelClass}
          minimizeClicked={this.handleMimimizeClick}
          closeClicked={this.handleCloseClick}
          mapViewPortChange={this.handleMapViewportChange}
        />
        <MapBlock className={mapBlockClass}>
          <ReactResizeDetector handleWidth handleHeight onResize={() => { if (this.map) this.map.resize() }} />
          <Map
            style={this.mapStyle}
            containerStyle={this.containerStyle}
            center={this.center}
            zoom={this.zoom}
            onZoomEnd={this.handleZoomEnd}
            onStyleLoad={this.handleStyleLoad}
            onDragEnd={this.handleDragEnd}
          />
        </MapBlock>
        <ScoreBoardBlock>
          {
            recommendations.map((recommendation, index) => {
              const { name, score } = recommendation
              return <div key={index} style={{ color: this.colors[index % 5] }}>{name} : {score}</div>
            })
          }
        </ScoreBoardBlock>
        { brochure && <Brochure name={brochure} />}
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  recommendations: selectRecommendations(),
  places: selectPlaces(),
})

const actions = {
  mapChange,
  fetchQuestInfo,
  fetchRecommendations,
  setDefaultQuest,
}

export default connect(selectors, actions)(QuestPage)
