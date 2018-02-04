import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Container } from 'reactstrap'
import cx from 'classnames'
import { isEqual } from 'lodash'
import { selectUserWishlist } from 'containers/App/selectors'
import { QuestButton } from 'components/Buttons'
import MapLoader from 'components/MapLoader'
import Map from 'components/Map'
import SidePanel from 'components/SidePanel'
import ScoreBoard from 'components/ScoreBoard'
import { initialViewport } from 'utils/globalConstants'
import { getItem } from 'utils/localStorage'
import { getQuestInfoRequest, setQuest, setPanelState } from './actions'
import { SET_QUEST, SET_URL_ENTERED_QUEST } from './constants'
import {
  selectRecommendations,
  selectViewport,
  selectCurrentTypes,
  selectCurrentDescriptives,
  selectCurrentQuest,
  selectInfo,
  selectCurQuestInd,
  selectPanelState,
} from './selectors'
import './style.scss'

class QuestPage extends Component {
  static propTypes = {
    getQuestInfoRequest: PropTypes.func,
    setQuest: PropTypes.func,
    setPanelState: PropTypes.func,
    viewport: PropTypes.object,
    descriptives: PropTypes.object,
    types: PropTypes.object,
    quest: PropTypes.object,
    location: PropTypes.object,
    info: PropTypes.object,
    params: PropTypes.object,
    wishlist: PropTypes.array,
    recommendations: PropTypes.array,
    panelState: PropTypes.string,
    curQuestInd: PropTypes.number,
  }

  componentWillMount() {
    const { params, getQuestInfoRequest } = this.props
    if (!params.viewport) {
      browserHistory.push(`/quest/${initialViewport}`)
      getQuestInfoRequest({ params: { viewport: initialViewport, types: undefined, descriptives: undefined }, urlEntered: true })
    } else {
      getQuestInfoRequest({ params, urlEntered: true })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.params, nextProps.params)) {
      const { params, setQuest } = nextProps
      setQuest({ params, urlEntered: false })
    }
  }

  handleQuestBtnClick = state => {
    const { setPanelState } = this.props
    setPanelState(state)
  }

  handleMapClick = () => {
    if (window.innerWidth < 768) {
      const { setPanelState } = this.props
      setPanelState('minimized')
    }
  }

  isFetching = () => {
    const { info: { status } } = this.props
    return status === (SET_QUEST || SET_URL_ENTERED_QUEST)
  }

  render() {
    const { recommendations, info, viewport, wishlist, curQuestInd, panelState } = this.props
    const mapData = { panelState, recommendations, info, wishlist, viewport }
    const questCnt = JSON.parse(getItem('quests')).length
    const sidePanelData = { panelState, curQuestInd, questCnt }

    return (
      <Container fluid className="questPage">
        <Helmet meta={[{ name: 'Quest', content: 'Carta' }]} />
        {this.isFetching() && panelState !== 'closed' && <MapLoader className={cx({ panelOpened: panelState === 'opened', panelClosed: panelState === 'minimized' })} />}
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
          {...sidePanelData}
          onMinimizeClick={() => {
            this.handleQuestBtnClick('minimized')
          }}
          onCloseClick={() => {
            this.handleQuestBtnClick('closed')
          }}
        />
        <Map {...mapData} onCLick={this.handleMapClick} />
        {recommendations.length > 0 && <ScoreBoard recommendations={recommendations} />}
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
  curQuestInd: selectCurQuestInd(),
  wishlist: selectUserWishlist(),
  panelState: selectPanelState(),
})

const actions = {
  setQuest,
  setPanelState,
  getQuestInfoRequest,
}

export default connect(selectors, actions)(QuestPage)
