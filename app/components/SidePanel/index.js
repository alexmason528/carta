import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router'
import { questAdd, questSelect, questRemove } from 'containers/QuestPage/actions'
import { selectQuestCnt, selectCurQuestInd } from 'containers/QuestPage/selectors'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'
import Quest from '../Quest'
import './style.scss'

class SidePanel extends Component {
  static propTypes = {
    onMinimizeClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    questAdd: PropTypes.func,
    questSelect: PropTypes.func,
    questRemove: PropTypes.func,
    params: PropTypes.object,
    curQuestInd: PropTypes.number,
    questCnt: PropTypes.number,
    panelState: PropTypes.string,
  }

  handleQuestRemove = (evt, ind) => {
    evt.preventDefault()

    const { curQuestInd, questCnt, questRemove } = this.props
    if (curQuestInd !== ind && questCnt !== 1) questRemove(ind)
  }

  render() {
    const { curQuestInd, panelState, onMinimizeClick, questCnt, onCloseClick, questAdd, questSelect, params: { brochure } } = this.props
    const quests = Array(questCnt).fill(0)
    return (
      <div
        className={cx({
          sidePanel: true,
          'Bs-Bb': true,
          'P-R': true,
          sidePanel__hidden: panelState !== 'opened' || brochure,
        })}
      >
        <div>
          <button className="sidePanel__minimizeBtn" onClick={onMinimizeClick}>
            <Img src={`${S3_ICON_URL}/min.png`} />
          </button>
          <button className="sidePanel__closeBtn" onClick={onCloseClick}>
            <Img src={`${S3_ICON_URL}/close.png`} />
          </button>
        </div>
        <div className="sidePanel__questIndexBtnList">
          {quests.map((quest, index) => (
            <button
              className={cx({
                sidePanel__questIndexBtn: true,
                'sidePanel__questIndexBtn--active': index === curQuestInd,
              })}
              key={index}
              onClick={() => {
                questSelect(index)
              }}
              onContextMenu={evt => {
                this.handleQuestRemove(evt, index)
              }}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="sidePanel__questAddBtn"
            onClick={() => {
              questAdd()
            }}
          >
            +
          </button>
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
}

export default compose(withRouter, connect(selectors, actions))(SidePanel)
