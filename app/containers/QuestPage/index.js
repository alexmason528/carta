import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import Helmet from 'react-helmet'
import cx from 'classnames'
import { isEqual } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Container } from 'reactstrap'
import Brochure from 'containers/Brochure'
import { Button, QuestButton } from 'components/Buttons'
import Map from 'components/Map'
import Menu from 'components/Menu'
import SidePanel from 'components/SidePanel'
import ScoreBoard from 'components/ScoreBoard'
import { urlParser, urlComposer } from 'utils/urlHelper'
import { getQuestInfoRequest, getRecommendationRequest } from './actions'
import {
  selectRecommendations,
  selectViewport,
  selectCurrentTypes,
  selectCurrentDescriptives,
} from './selectors'
import './style.scss'

class QuestPage extends Component {
  static propTypes = {
    getQuestInfoRequest: PropTypes.func,
    getRecommendationRequest: PropTypes.func,
    injectIntl: PropTypes.func,
    viewport: PropTypes.object,
    descriptives: PropTypes.object,
    types: PropTypes.object,
    location: PropTypes.object,
    recommendations: PropTypes.array,
    params: PropTypes.shape({
      brochure: PropTypes.string,
      viewport: PropTypes.string,
      types: PropTypes.string,
      descriptives: PropTypes.string,
    }),
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { panelState: 'opened' }
  }

  componentWillMount() {
    const { params: { viewport, types, descriptives }, intl: { locale }, getQuestInfoRequest } = this.props
    let questData = null
    if (viewport && types && descriptives) {
      const res = urlParser(viewport, types, descriptives, locale)
      if (res) questData = { quest: res, locale }
    }
    getQuestInfoRequest(questData)
  }

  componentWillReceiveProps(nextProps) {
    const { types, descriptives, viewport, location: { pathname } } = this.props
    const { params: { brochure }, intl: { locale } } = nextProps
    const isViewportEqual = isEqual(viewport, nextProps.viewport)
    const isTypesEqual = isEqual(types, nextProps.types)
    const isDescriptivesEqual = isEqual(descriptives, nextProps.descriptives)
    const shouldUpdate = (pathname === nextProps.location.pathname && brochure === nextProps.brochure)

    if ((!isViewportEqual || !isTypesEqual || !isDescriptivesEqual) && shouldUpdate) {
      const { url } = urlComposer(nextProps.viewport, nextProps.types, nextProps.descriptives, locale, brochure)
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
        <Menu currentPage="Quest" />
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
        { brochure && <Brochure name={brochure} />}
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  recommendations: selectRecommendations(),
  viewport: selectViewport(),
  types: selectCurrentTypes(),
  descriptives: selectCurrentDescriptives(),
})

const actions = {
  getQuestInfoRequest,
  getRecommendationRequest,
}

export default compose(
  injectIntl,
  connect(selectors, actions),
)(QuestPage)
