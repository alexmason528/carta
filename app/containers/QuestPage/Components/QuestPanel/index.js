import React, { Component, PropTypes, Children } from 'react'
import styled, { css } from 'styled-components'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { fetchRecommendations, questAdd, questSelect, questRemove } from 'containers/QuestPage/actions'
import { selectQuests, selectCurrentQuestIndex } from 'containers/QuestPage/selectors'
import Quest from '../Quest'
import './style.scss'

class QuestPanel extends Component {
  static propTypes = {
    minimizeClicked: PropTypes.func.isRequired,
    closeClicked: PropTypes.func.isRequired,
    mapViewPortChange: PropTypes.func,
    fetchRecommendations: PropTypes.func,
    questAdd: PropTypes.func,
    questSelect: PropTypes.func,
    questRemove: PropTypes.func,
    quests: PropTypes.array,
    currentQuestIndex: PropTypes.number,
    className: PropTypes.string,
  }

  handleQuestAdd = () => {
    const { questAdd } = this.props
    questAdd()
  }

  handleQuestSelect = index => {
    const { questSelect, fetchRecommendations } = this.props

    questSelect(index)
    fetchRecommendations()
  }

  handleQuestRemove = (evt, index) => {
    evt.preventDefault()

    const { currentQuestIndex, quests, questRemove } = this.props
    if (currentQuestIndex !== index && quests.length !== 1) questRemove(index)
  }

  render() {
    const { quests, currentQuestIndex, className, minimizeClicked, closeClicked, mapViewPortChange } = this.props
    return (
      <div className={className}>
        <div className="buttons">
          <button className="minimize" onClick={minimizeClicked}>
            <img src={`${CLOUDINARY_ICON_URL}/min.png`} role="presentation" />
          </button>
          <button className="close" onClick={closeClicked}>
            <img src={`${CLOUDINARY_ICON_URL}/close.png`} role="presentation" />
          </button>
        </div>
        <div className="list">
          {
            quests.map((quest, index) => {
              const questTabClass = classNames({
                item: true,
                on: index === currentQuestIndex,
              })
              return (
                <button
                  className={questTabClass}
                  key={index}
                  onClick={() => { this.handleQuestSelect(index) }}
                  onContextMenu={evt => { this.handleQuestRemove(evt, index) }}
                >
                  {index + 1}
                </button>
              )
            })
          }
          <button className="add-quest" onClick={this.handleQuestAdd}>+</button>
        </div>
        <div className="quests">
          {
            quests.map((quest, index) => {
              const questClass = classNames({
                quest: true,
                show: index === currentQuestIndex,
              })
              return (
                <Quest key={index} className={questClass} mapViewPortChange={mapViewPortChange}>
                  {index}
                </Quest>
              )
            })
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
  fetchRecommendations,
}


export default connect(selectors, actions)(QuestPanel)
