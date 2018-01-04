import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { isEqual } from 'lodash'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container } from 'reactstrap'
import Brochure from 'containers/Brochure'
import { QuestButton } from 'components/Buttons'
import Map from 'components/Map'
import Menu from 'components/Menu'
import SidePanel from 'components/SidePanel'
import ScoreBoard from 'components/ScoreBoard'
import { urlParser, urlComposer } from 'utils/urlHelper'
import { getQuestInfoRequest, setQuest } from './actions'
import { initialQuest } from './reducer'
import {
  selectRecommendations,
  selectViewport,
  selectCurrentTypes,
  selectCurrentDescriptives,
  selectCurrentQuest,
  selectInfo,
} from './selectors'
import './style.scss'
import { PLACE_CLICK } from './constants'

class QuestPage extends Component {
  static propTypes = {
    getQuestInfoRequest: PropTypes.func,
    setQuest: React.PropTypes.func,
    viewport: PropTypes.object,
    descriptives: PropTypes.object,
    quest: PropTypes.object,
    types: PropTypes.object,
    location: PropTypes.object,
    info: PropTypes.object,
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
    const {
      params: { viewport, types, descriptives },
      getQuestInfoRequest,
    } = this.props
    getQuestInfoRequest(urlParser({ viewport, types, descriptives }))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.info.status === PLACE_CLICK) {
      return
    }
    if (!isEqual(this.props.params, nextProps.params)) {
      const { params: { viewport, types, descriptives }, setQuest } = nextProps
      setQuest(urlParser({ viewport, types, descriptives }))
      return
    }

    const { viewport, types, descriptives, location: { pathname } } = this.props
    const { params, quest } = nextProps
    const isViewportEqual = isEqual(viewport, nextProps.viewport)
    const isTypesEqual = isEqual(types, nextProps.types)
    const isDescriptivesEqual = isEqual(descriptives, nextProps.descriptives)
    const isParamEmpty =
      !params.viewport && !params.types && !params.descriptives
    const isParamEqual = isViewportEqual && isTypesEqual && isDescriptivesEqual
    const isInitialQuest = isEqual(initialQuest, quest)
    const shouldUpdate =
      pathname === nextProps.location.pathname &&
      params.brochure === nextProps.brochure
    const { url, sendRequest } = urlComposer({
      viewport: nextProps.viewport,
      types: nextProps.types,
      descriptives: nextProps.descriptives,
      brochure: params.brochure,
    })
    if (
      (!isParamEqual && shouldUpdate) ||
      (isParamEmpty && !isInitialQuest && sendRequest)
    ) {
      browserHistory.push(url)
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
          onClick={() => {
            this.handleQuestBtnClick('opened')
          }}
          onCloseClick={() => {
            this.handleQuestBtnClick('closed')
          }}
        />
        <SidePanel
          panelState={panelState}
          onMinimizeClick={() => {
            this.handleQuestBtnClick('minimized')
          }}
          onCloseClick={() => {
            this.handleQuestBtnClick('closed')
          }}
        />
        <Map panelState={panelState} />
        {recommendations.length > 0 && (
          <ScoreBoard recommendations={recommendations} />
        )}
        {brochure && <Brochure link={brochure} />}
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
  info: selectInfo(),
})

const actions = {
  setQuest,
  getQuestInfoRequest,
}

export default connect(selectors, actions)(QuestPage)
