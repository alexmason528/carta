import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container } from 'reactstrap'
import cx from 'classnames'
import { isEqual } from 'lodash'
import Brochure from 'containers/Brochure'
import { QuestButton } from 'components/Buttons'
import MapLoader from 'components/MapLoader'
import Map from 'components/Map'
import SidePanel from 'components/SidePanel'
import ScoreBoard from 'components/ScoreBoard'
import { urlParser } from 'utils/urlHelper'
import { getQuestInfoRequest, setQuest, mapChange, questAdd, questSelect, questRemove } from './actions'
import { SET_QUEST } from './constants'
import {
  selectRecommendations,
  selectViewport,
  selectCurrentTypes,
  selectCurrentDescriptives,
  selectCurrentQuest,
  selectInfo,
  selectBrochureLink,
  selectQuestCnt,
  selectCurQuestInd,
} from './selectors'
import './style.scss'

class QuestPage extends Component {
  static propTypes = {
    getQuestInfoRequest: PropTypes.func,
    setQuest: PropTypes.func,
    mapChange: PropTypes.func,
    questAdd: PropTypes.func,
    questSelect: PropTypes.func,
    questRemove: PropTypes.func,
    viewport: PropTypes.object,
    descriptives: PropTypes.object,
    types: PropTypes.object,
    quest: PropTypes.object,
    location: PropTypes.object,
    info: PropTypes.object,
    params: PropTypes.object,
    recommendations: PropTypes.array,
    brochureLink: PropTypes.string,
    curQuestInd: PropTypes.number,
    questCnt: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.state = { panelState: 'opened' }
  }

  componentWillMount() {
    const { params, getQuestInfoRequest } = this.props
    getQuestInfoRequest({
      quest: urlParser({ ...params }),
      urlEntered: true,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { params } = this.props
    if (!isEqual(params, nextProps.params)) {
      const { setQuest } = nextProps
      setTimeout(() => {
        setQuest({
          quest: urlParser({ ...nextProps.params }),
          urlEntered: false,
        })
      }, 0)
    }
  }

  handleQuestBtnClick = state => {
    this.setState({ panelState: state })
  }

  handleMapClick = () => {
    if (window.innerWidth < 768) {
      this.setState({ panelState: 'minimized' })
    }
  }

  render() {
    const { panelState } = this.state
    const { recommendations, brochureLink, info, viewport, mapChange, curQuestInd, questCnt, questAdd, questSelect, questRemove } = this.props
    const isFetching = info.status === SET_QUEST

    return (
      <Container fluid className="questPage">
        <Helmet meta={[{ name: 'Quest', content: 'Carta' }]} />
        {isFetching &&
          panelState !== 'closed' && (
            <MapLoader
              className={cx({
                panelOpened: panelState === 'opened',
                panelClosed: panelState === 'minimized',
              })}
            />
          )}
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
          questAdd={questAdd}
          questSelect={questSelect}
          questRemove={questRemove}
          curQuestInd={curQuestInd}
          questCnt={questCnt}
        />
        <Map
          panelState={panelState}
          recommendations={recommendations}
          info={info}
          viewport={viewport}
          mapChange={mapChange}
          onClick={this.handleMapClick}
        />
        {recommendations.length > 0 && <ScoreBoard recommendations={recommendations} show />}
        {brochureLink && <Brochure brochureLink={brochureLink} />}
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
  brochureLink: selectBrochureLink(),
  info: selectInfo(),
  questCnt: selectQuestCnt(),
  curQuestInd: selectCurQuestInd(),
})

const actions = {
  setQuest,
  getQuestInfoRequest,
  mapChange,
  questAdd,
  questSelect,
  questRemove,
}

export default connect(selectors, actions)(QuestPage)
