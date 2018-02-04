import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import cx from 'classnames'
import { pullAt } from 'lodash'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'
import { getItem, setItem } from 'utils/localStorage'
import { getQuestUrl } from 'utils/urlHelper'
import Quest from '../Quest'
import './style.scss'

class SidePanel extends Component {
  static propTypes = {
    onMinimizeClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    panelState: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      questCnt: JSON.parse(getItem('quests')).length,
      curQuestInd: JSON.parse(getItem('curQuestInd')),
    }
  }

  handleQuestRemove = (evt, ind) => {
    evt.preventDefault()

    const { curQuestInd, questCnt } = this.state
    if (curQuestInd !== ind && questCnt !== 1) {
      let quests = JSON.parse(getItem('quests'))

      pullAt(quests, [ind])
      setItem('quests', JSON.stringify(quests))
      if (ind < curQuestInd) {
        setItem('curQuestInd', JSON.stringify(curQuestInd - 1))
      }

      this.setState(Object.assign({}, { questCnt: questCnt - 1 }, ind < curQuestInd && { curQuestInd: curQuestInd - 1 }))
    }
  }

  handleQuestAdd = () => {
    const { questCnt } = this.state
    let quests = JSON.parse(getItem('quests'))
    quests.push({})
    setItem('quests', JSON.stringify(quests))
    setItem('curQuestInd', JSON.stringify(quests.length - 1))
    this.setState({ questCnt: questCnt + 1, curQuestInd: quests.length - 1 })
    browserHistory.push(getQuestUrl())
  }

  handleQuestSelect = ind => {
    this.setState({ curQuestInd: ind }, () => {
      setItem('curQuestInd', ind)
      browserHistory.push(getQuestUrl())
    })
  }

  render() {
    const { panelState, onMinimizeClick, onCloseClick } = this.props
    const { curQuestInd, questCnt } = this.state
    const quests = Array(questCnt).fill(0)
    return (
      <div className={cx({ sidePanel: true, sidePanel__hidden: panelState !== 'opened' })}>
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
              className={cx({ sidePanel__questIndexBtn: true, 'sidePanel__questIndexBtn--active': index === curQuestInd })}
              key={index}
              onClick={() => {
                this.handleQuestSelect(index)
              }}
              onContextMenu={evt => {
                this.handleQuestRemove(evt, index)
              }}
            >
              {index + 1}
            </button>
          ))}
          <button className="sidePanel__questAddBtn" onClick={this.handleQuestAdd}>
            +
          </button>
        </div>
        <Quest />
      </div>
    )
  }
}

export default SidePanel
