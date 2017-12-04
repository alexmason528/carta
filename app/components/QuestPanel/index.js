import React, { Component, PropTypes, Children } from 'react'
import styled, { css } from 'styled-components'
import cx from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { getRecommendationRequest, questAdd, questSelect, questRemove } from 'containers/QuestPage/actions'
import { selectQuests, selectCurrentQuestIndex } from 'containers/QuestPage/selectors'
import Img from 'components/Img'
import Quest from '../Quest'
import './style.scss'

class QuestPanel extends Component {
  static propTypes = {
    minimizeClicked: PropTypes.func.isRequired,
    closeClicked: PropTypes.func.isRequired,
    mapViewPortChange: PropTypes.func,
    getRecommendationRequest: PropTypes.func,
    questAdd: PropTypes.func,
    questSelect: PropTypes.func,
    questRemove: PropTypes.func,
    quests: PropTypes.array,
    currentQuestIndex: PropTypes.number,
    className: PropTypes.string,
  }

  handleQuestAdd = () => {
    this.props.questAdd()
  }

  handleQuestSelect = index => {
    this.props.questSelect(index)
    this.props.getRecommendationRequest()
  }

  handleQuestRemove = (evt, index) => {
    evt.preventDefault()

    const { currentQuestIndex, quests } = this.props
    if (currentQuestIndex !== index && quests.length !== 1) this.props.questRemove(index)
  }

  render() {
    const { quests, currentQuestIndex, className, minimizeClicked, closeClicked, mapViewPortChange } = this.props
    return (
      <div className={className}>
        <div className="buttons">
          <button className="minimize" onClick={minimizeClicked}>
            <Img src={`${CLOUDINARY_ICON_URL}/min.png`} />
          </button>
          <button className="close" onClick={closeClicked}>
            <Img src={`${CLOUDINARY_ICON_URL}/close.png`} />
          </button>
        </div>
        <div className="list">
          {
            quests.map((quest, index) => (
              <button
                className={cx({ item: true, on: index === currentQuestIndex })}
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
        <div className="quests">
          {
            quests.map((quest, index) => (
              <Quest key={index} className={cx({ quest: true, show: index === currentQuestIndex })} mapViewPortChange={mapViewPortChange}>
                {index}
              </Quest>
            ))
          }
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  quests: selectQuests(),
  currentQuestIndex: selectCurrentQuestIndex(),
})

const actions = {
  questAdd,
  questSelect,
  questRemove,
  getRecommendationRequest,
}

export default connect(selectors, actions)(QuestPanel)
