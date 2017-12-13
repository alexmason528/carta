import React, { Component, PropTypes, Children } from 'react'
import styled, { css } from 'styled-components'
import cx from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { getRecommendationRequest, questAdd, questSelect, questRemove } from 'containers/QuestPage/actions'
import { selectQuestCnt, selectCurQuestInd } from 'containers/QuestPage/selectors'
import Img from 'components/Img'
import Quest from '../Quest'
import './style.scss'

class SidePanel extends Component {
  static propTypes = {
    onMinimizeClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    getRecommendationRequest: PropTypes.func,
    questAdd: PropTypes.func,
    questSelect: PropTypes.func,
    questRemove: PropTypes.func,
    curQuestInd: PropTypes.number,
    questCnt: PropTypes.number,
    panelState: PropTypes.string,
  }

  handleQuestAdd = () => {
    const { questAdd } = this.props
    questAdd()
  }

  handleQuestSelect = ind => {
    const { questSelect, getRecommendationRequest } = this.props
    questSelect(ind)
    getRecommendationRequest()
  }

  handleQuestRemove = (evt, ind) => {
    evt.preventDefault()

    const { curQuestInd, questCnt, questRemove } = this.props
    if (curQuestInd !== ind && questCnt !== 1) questRemove(ind)
  }

  render() {
    const { curQuestInd, panelState, onMinimizeClick, questCnt, onCloseClick } = this.props
    const quests = Array(questCnt).fill(0)
    return (
      <div className={cx({ sidePanel: true, sidePanel__hidden: panelState !== 'opened' })}>
        <div>
          <button className="sidePanel__minimizeBtn" onClick={onMinimizeClick}>
            <Img src={`${CLOUDINARY_ICON_URL}/min.png`} />
          </button>
          <button className="sidePanel__closeBtn" onClick={onCloseClick}>
            <Img src={`${CLOUDINARY_ICON_URL}/close.png`} />
          </button>
        </div>
        <div className="sidePanel__questIndexBtnList">
          {
            quests.map((quest, index) => (
              <button
                className={cx({ sidePanel__questIndexBtn: true, 'sidePanel__questIndexBtn--active': index === curQuestInd })}
                key={index}
                onClick={() => { this.handleQuestSelect(index) }}
                onContextMenu={evt => { this.handleQuestRemove(evt, index) }}
              >
                {index + 1}
              </button>
            ))
          }
          <button className="sidePanel__questAddBtn" onClick={this.handleQuestAdd}>+</button>
        </div>
        <Quest />
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  questCnt: selectQuestCnt(),
  curQuestInd: selectCurQuestInd(),
})

const actions = {
  questAdd,
  questSelect,
  questRemove,
  getRecommendationRequest,
}

export default connect(selectors, actions)(SidePanel)
