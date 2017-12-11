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
    className: PropTypes.string,
  }

  handleQuestAdd = () => {
    this.props.questAdd()
  }

  handleQuestSelect = ind => {
    this.props.questSelect(ind)
    this.props.getRecommendationRequest()
  }

  handleQuestRemove = (evt, ind) => {
    evt.preventDefault()

    const { curQuestInd, questCnt } = this.props
    if (curQuestInd !== ind && questCnt !== 1) this.props.questRemove(ind)
  }

  render() {
    const { curQuestInd, className, onMinimizeClick, questCnt, onCloseClick } = this.props
    const quests = Array(questCnt).fill(0)
    return (
      <div className={className}>
        <div className="buttons">
          <button className="minimize" onClick={onMinimizeClick}>
            <Img src={`${CLOUDINARY_ICON_URL}/min.png`} />
          </button>
          <button className="close" onClick={onCloseClick}>
            <Img src={`${CLOUDINARY_ICON_URL}/close.png`} />
          </button>
        </div>
        <div className="list">
          {
            quests.map((quest, index) => (
              <button
                className={cx({ item: true, on: index === curQuestInd })}
                key={index}
                onClick={() => { this.handleQuestSelect(index) }}
                onContextMenu={evt => { this.handleQuestRemove(evt, index) }}
              >
                {index + 1}
              </button>
            ))
          }
          <button className="add-quest" onClick={this.handleQuestAdd}>+</button>
        </div>
        <Quest className="quest" />
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
