import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { isEqual } from 'lodash'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container } from 'reactstrap'
import Brochure from 'containers/Brochure'
import { QuestButton } from 'components/Buttons'
import Map from 'components/Map'
import Menu from 'components/Menu'
import SidePanel from 'components/SidePanel'
import ScoreBoard from 'components/ScoreBoard'
import { urlParser } from 'utils/urlHelper'
import { getQuestInfoRequest, setQuest } from './actions'
import {
  selectRecommendations,
  selectViewport,
  selectCurrentTypes,
  selectCurrentDescriptives,
  selectCurrentQuest,
  selectInfo,
} from './selectors'
import './style.scss'

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
      params: { viewport, types, descriptives, brochure },
      getQuestInfoRequest,
    } = this.props

    getQuestInfoRequest({
      quest: urlParser({ viewport, types, descriptives, brochure }),
      urlEntered: true,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { params } = this.props
    if (params !== nextProps.params) {
      const {
        params: { viewport, types, descriptives, brochure },
        setQuest,
      } = nextProps
      setQuest({
        quest: urlParser({ viewport, types, descriptives, brochure }),
        urlEntered: false,
      })
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
