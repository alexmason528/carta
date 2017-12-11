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
import { urlParser, composeUrl } from 'utils/urlHelper'
import { mapChange, getQuestInfoRequest, getRecommendationRequest } from './actions'
import {
  selectRecommendations,
  selectPlaces,
  selectViewport,
  selectCurrentTypes,
  selectCurrentDescriptives,
} from './selectors'

class QuestPage extends Component {
  static propTypes = {
    mapChange: PropTypes.func,
    getQuestInfoRequest: PropTypes.func,
    getRecommendationRequest: PropTypes.func,
    injectIntl: PropTypes.func,
    viewport: PropTypes.object,
    descriptives: PropTypes.object,
    types: PropTypes.object,
    location: PropTypes.object,
    recommendations: PropTypes.array,
    places: PropTypes.array,
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

    this.state = {
      panelState: 'opened',
    }
  }

  componentWillMount() {
    const { params: { viewport, types, descriptives }, intl: { locale }, getRecommendationRequest } = this.props

    let questData = null
    if (viewport && types && descriptives) {
      const res = urlParser(viewport, types, descriptives)

      if (res) {
        questData = { quest: res, locale }
      }
    }

    this.props.getQuestInfoRequest(questData)
  }

  componentWillReceiveProps(nextProps) {
    // const { types, descriptives, viewport, location: { pathname } } = this.props

    // const isViewportEqual = isEqual(viewport, nextProps.viewport)
    // const isTypesEqual = isEqual(types, nextProps.types)
    // const isDescriptivesEqual = isEqual(descriptives, nextProps.descriptives)
    // const shouldUpdate = pathname !== nextProps.location.pathname

    // if (!isViewportEqual || !isTypesEqual || !isDescriptivesEqual || shouldUpdate) {
    //   const { url, sendRequest, viewport, types, descriptives } = composeUrl(nextProps.viewport, nextProps.types, nextProps.descriptives)
    //   if (pathname !== url) {
    //     if (sendRequest) {
    //       browserHistory.push(url)
    //     } else {
    //       browserHistory.push('/quest')
    //     }
    //     this.props.getRecommendationRequest()
    //   }
    // }

    // this.handleRedrawMap(nextProps)
  }

  handleQuestButtonClick = state => {
    this.setState({
      panelState: state,
    })
  }

  render() {
    const { panelState } = this.state
    const { recommendations, params: { brochure } } = this.props

    return (
      <Container fluid className="questpage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <Menu currentPage="Quest" />
        <QuestButton
          className={cx({ questBtn: true, questBtn__opened: panelState === 'minimized', questBtn__closed: panelState !== 'minimized' })}
          onClick={() => { this.handleQuestButtonClick('opened') }}
          onCloseClick={() => { this.handleQuestButtonClick('closed') }}
        />
        <SidePanel
          className={cx({ 'quest-block': true, 'quest-hide': panelState !== 'opened' })}
          onMinimizeClick={() => { this.handleQuestButtonClick('minimized') }}
          onCloseClick={() => { this.handleQuestButtonClick('closed') }}
        />
        <Map className={cx({ 'map-block': true, 'no-quest-block': panelState !== 'opened' })} panelState={panelState} />
        { (recommendations.length > 0) && <ScoreBoard recommendations={recommendations} /> }
        { brochure && <Brochure name={brochure} />}
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  recommendations: selectRecommendations(),
  places: selectPlaces(),
  viewport: selectViewport(),
  types: selectCurrentTypes(),
  descriptives: selectCurrentDescriptives(),
})

const actions = {
  mapChange,
  getQuestInfoRequest,
  getRecommendationRequest,
}

export default compose(
  injectIntl,
  connect(selectors, actions),
)(QuestPage)
