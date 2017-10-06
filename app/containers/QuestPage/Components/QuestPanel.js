import React, { Component, PropTypes, Children } from 'react'
import styled, { css } from 'styled-components'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { fetchRecommendations, questAdd, questSelect, questRemove } from '../actions'
import { selectQuests, selectCurrentQuestIndex } from '../selectors'
import Quest from './Quest'
import '../style.scss'

class QuestPanel extends Component {
  questAddHandler = () => {
    this.props.questAdd()
  }

  questSelectHandler = index => {
    this.props.questSelect(index)
    this.props.fetchRecommendations()
  }

  questRemoveHandler = (evt, index) => {
    evt.preventDefault()
    const { currentQuestIndex, quests } = this.props
    if (currentQuestIndex === index || quests.length === 1) return
    this.props.questRemove(index)
  }

  render() {
    const { quests, currentQuestIndex, className } = this.props
    return (
      <div className={className}>
        <div className="buttons">
          <button className="minimize" onClick={() => { this.props.minimizeClicked() }}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/min.png" role="presentation" /></button>
          <button className="close" onClick={() => { this.props.closeClicked() }}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/close.png" role="presentation" /></button>
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
                  onClick={() => { this.questSelectHandler(index) }}
                  onContextMenu={evt => { this.questRemoveHandler(evt, index) }}
                >
                  {index + 1}
                </button>
              )
            })
          }
          <button className="add-quest" onClick={this.questAddHandler}>+</button>
        </div>
        <div className="quests">
          {
            quests.map((quest, index) => {
              const questClass = classNames({
                quest: true,
                show: index === currentQuestIndex,
              })
              return (
                <Quest key={index} className={questClass} mapViewPortChange={this.props.mapViewPortChange}>
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

QuestPanel.propTypes = {
  minimizeClicked: PropTypes.func.isRequired,
  closeClicked: PropTypes.func.isRequired,
  quests: PropTypes.array,
  currentQuestIndex: PropTypes.number,
  className: PropTypes.string,
  mapViewPortChange: PropTypes.func,
  fetchRecommendations: PropTypes.func,
  questAdd: PropTypes.func,
  questSelect: PropTypes.func,
  questRemove: PropTypes.func,
}

function mapDispatchToProps(dispatch) {
  return {
    questAdd: () => dispatch(questAdd()),
    questSelect: index => dispatch(questSelect(index)),
    questRemove: index => dispatch(questRemove(index)),
    fetchRecommendations: () => dispatch(fetchRecommendations()),
  }
}

const mapStateToProps = createStructuredSelector({
  quests: selectQuests(),
  currentQuestIndex: selectCurrentQuestIndex(),
})

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(QuestPanel)
