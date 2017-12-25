import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { isEqual } from 'lodash'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container } from 'reactstrap'
import { MAPBOX_DEFAULT_CENTER } from 'containers/App/constants'
import Brochure from 'containers/Brochure'
import { QuestButton } from 'components/Buttons'
import Map from 'components/Map'
import Menu from 'components/Menu'
import SidePanel from 'components/SidePanel'
import ScoreBoard from 'components/ScoreBoard'
import { urlParser, urlComposer } from 'utils/urlHelper'
import { getQuestInfoRequest, getRecommendationRequest } from './actions'
import { initialQuest } from './reducer'
import {
  selectRecommendations,
  selectViewport,
  selectCurrentTypes,
  selectCurrentDescriptives,
  selectCurrentQuest,
} from './selectors'
import './style.scss'

class QuestPage extends Component {
  static propTypes = {
    getQuestInfoRequest: PropTypes.func,
    getRecommendationRequest: PropTypes.func,
    viewport: PropTypes.object,
    descriptives: PropTypes.object,
    quest: PropTypes.object,
    types: PropTypes.object,
    location: PropTypes.object,
    recommendations: PropTypes.array,
    params: PropTypes.shape({
      brochure: PropTypes.string,
      viewport: PropTypes.string,
      types: PropTypes.string,
      descriptives: PropTypes.string,
    }),
  }

  constructor(props) {
    super(props)
    this.state = { panelState: 'opened' }
  }

  componentWillMount() {
    const { params: { viewport, types, descriptives }, getQuestInfoRequest } = this.props
    let quest = null
    if (viewport && types && descriptives) {
      quest = urlParser({ viewport, types, descriptives })
    }
    getQuestInfoRequest(quest)
  }

  componentWillReceiveProps(nextProps) {
    const { viewport, types, descriptives, location: { pathname } } = this.props
    const { params, quest } = nextProps
    const isViewportEqual = isEqual(viewport, nextProps.viewport)
    const isTypesEqual = isEqual(types, nextProps.types)
    const isDescriptivesEqual = isEqual(descriptives, nextProps.descriptives)
    const isParamEmpty = !params.viewport && !params.types && !params.descriptives
    const isParamEqual = isViewportEqual && isTypesEqual && isDescriptivesEqual
    const isInitialQuest = isEqual(initialQuest, quest)
    const shouldUpdate = (pathname === nextProps.location.pathname && params.brochure === nextProps.brochure)
    const { url, sendRequest } = urlComposer({
      viewport: nextProps.viewport,
      types: nextProps.types,
      descriptives: nextProps.descriptives,
      brochure: params.brochure,
    })

    if ((!isParamEqual && shouldUpdate) || (isParamEmpty && !isInitialQuest && sendRequest)) {
      if (!isEqual(nextProps.viewport.center, MAPBOX_DEFAULT_CENTER)) {
        browserHistory.push(url)
      }
    }
  }

  handleQuestBtnClick = state => {
    this.setState({ panelState: state })
  }

  render() {
    const { panelState } = this.state
    const { recommendations, params: { brochure } } = this.props

    return (
      <Container fluid className="questPage">
        <Helmet meta={[{ name: 'Quest', content: 'Carta' }]} />
        <Menu currentPage="quest" />
        <QuestButton
          panelState={panelState}
          onClick={() => { this.handleQuestBtnClick('opened') }}
          onCloseClick={() => { this.handleQuestBtnClick('closed') }}
        />
        <SidePanel
          panelState={panelState}
          onMinimizeClick={() => { this.handleQuestBtnClick('minimized') }}
          onCloseClick={() => { this.handleQuestBtnClick('closed') }}
        />
        <Map panelState={panelState} />
        { (recommendations.length > 0) && <ScoreBoard recommendations={recommendations} /> }
        { brochure && <Brochure link={brochure} />}
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  recommendations: selectRecommendations(),
  viewport: selectViewport(),
  types: selectCurrentTypes(),
  descriptives: selectCurrentDescriptives(),
  quest: selectCurrentQuest(),
})

const actions = {
  getQuestInfoRequest,
  getRecommendationRequest,
}

export default connect(selectors, actions)(QuestPage)
