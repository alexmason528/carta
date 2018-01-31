import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { createStructuredSelector } from 'reselect'
import { Container } from 'reactstrap'
import cx from 'classnames'
import { selectUserWishlist } from 'containers/App/selectors'
import Brochure from 'containers/Brochure'
import { QuestButton } from 'components/Buttons'
import MapLoader from 'components/MapLoader'
import Map from 'components/Map'
import SidePanel from 'components/SidePanel'
import ScoreBoard from 'components/ScoreBoard'
import { urlParser, urlComposer } from 'utils/urlHelper'
import { paramsChanged } from 'utils/propsHelper'
import { getQuestInfoRequest, updateBrochureLink, setQuest, mapChange, questAdd, questSelect, questRemove } from './actions'
import {
  GET_RECOMMENDATION_REQUEST,
  SET_QUEST,
  QUEST_SELECT,
  MAP_CHANGE,
  TYPE_CLICK,
  TYPE_ANYTHING_CLICK,
  DESCRIPTIVE_ANYTHING_CLICK,
  DESCRIPTIVE_CLICK,
  DESCRIPTIVE_STAR_CLICK,
} from './constants'
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
    updateBrochureLink: PropTypes.func,
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
    wishlist: PropTypes.array,
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
    getQuestInfoRequest(urlParser({ ...params }))
  }

  componentWillReceiveProps(nextProps) {
    if (paramsChanged(this.props, nextProps)) {
      const { viewport, types, descriptives, brochure } = nextProps
      const url = urlComposer({ viewport, types, descriptives, brochure })
      browserHistory.push(url)
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

  isFetching = () => {
    const { info: { status } } = this.props
    const fetchingList = [
      GET_RECOMMENDATION_REQUEST,
      SET_QUEST,
      QUEST_SELECT,
      MAP_CHANGE,
      TYPE_CLICK,
      TYPE_ANYTHING_CLICK,
      DESCRIPTIVE_ANYTHING_CLICK,
      DESCRIPTIVE_CLICK,
      DESCRIPTIVE_STAR_CLICK,
    ]
    return fetchingList.indexOf(status) !== -1
  }

  render() {
    const { panelState } = this.state
    const { recommendations, brochureLink, info, viewport, wishlist, mapChange, updateBrochureLink, curQuestInd, questCnt, questAdd, questSelect, questRemove } = this.props
    const mapData = { panelState, recommendations, info, wishlist, viewport, mapChange, updateBrochureLink }
    const sidePanelData = { panelState, questAdd, questSelect, questRemove, curQuestInd, questCnt }

    return (
      <Container fluid className="questPage">
        <Helmet meta={[{ name: 'Quest', content: 'Carta' }]} />
        {/* {this.isFetching() &&
          panelState !== 'closed' && (
            <MapLoader
              className={cx({
                panelOpened: panelState === 'opened',
                panelClosed: panelState === 'minimized',
              })}
            />
          )} */}
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
  wishlist: selectUserWishlist(),
})

const actions = {
  setQuest,
  getQuestInfoRequest,
  updateBrochureLink,
  mapChange,
  questAdd,
  questSelect,
  questRemove,
}

export default connect(selectors, actions)(QuestPage)
