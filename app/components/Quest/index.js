import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { compose } from 'redux'
import { connect } from 'react-redux'
import cx from 'classnames'
import { createStructuredSelector } from 'reselect'
import { SET_URL_ENTERED_QUEST } from 'containers/QuestPage/constants'
import { updateExpand } from 'containers/QuestPage/actions'
import { selectInfo, selectCurrentTypes, selectCurrentDescriptives } from 'containers/QuestPage/selectors'
import messages from 'containers/QuestPage/messages'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'
import { DescriptiveSection, PlaceSection, TypeSection } from '../Sections'
import './style.scss'

class Quest extends Component {
  static propTypes = {
    className: PropTypes.string,
    currentTypes: PropTypes.object,
    currentDescriptives: PropTypes.object,
    updateExpand: PropTypes.func,
    info: PropTypes.object,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { currentTab: 0 }
  }

  componentWillMount() {
    this.initializeProps(this.props)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeypress)
  }

  componentWillReceiveProps(nextProps) {
    this.initializeProps(nextProps)
  }

  componentWillUnmount() {
    window.addEventListener('keydown', this.handleKeypress)
  }

  initializeProps = props => {
    const { currentTypes, currentDescriptives, info: { status } } = props

    if (status === SET_URL_ENTERED_QUEST) {
      if (
        (currentTypes.all || currentTypes.includes.length > 0) &&
        (currentDescriptives.all || currentDescriptives.includes.length > 0 || currentDescriptives.stars.length > 0)
      ) {
        this.setState({ currentTab: 2 })
      } else if (
        currentTypes.all ||
        currentTypes.includes.length > 0 ||
        (currentDescriptives.all || currentDescriptives.includes.length > 0 || currentDescriptives.stars.length > 0)
      ) {
        this.setState({ currentTab: 1 })
      } else {
        this.setState({ currentTab: 0 })
      }
    }
  }

  handleKeypress = e => {
    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return
    if (e.keyCode === 9) {
      const { currentTab } = this.state
      this.handleTabClick((currentTab + 1) % 3)
    }
  }

  handleTabClick = currentTab => {
    this.setState({ currentTab })
    this.props.updateExpand()
  }

  handleNextBtnClick = () => {
    const { currentTab } = this.state
    this.handleTabClick((currentTab + 1) % 3)
    this.props.updateExpand()
  }

  render() {
    const { currentTab } = this.state
    const { intl: { formatMessage } } = this.props

    let section
    if (currentTab === 0) {
      section = <PlaceSection />
    } else if (currentTab === 1) {
      section = <TypeSection />
    } else {
      section = <DescriptiveSection />
    }

    const tabs = ['marker', 'check', 'star']

    return (
      <div className="quest">
        <div className="quest__tabs">
          <div className="quest__divider" />
          <button className="quest__nextBtn" onClick={this.handleNextBtnClick}>
            {formatMessage(messages.next)}
            <Img src={`${S3_ICON_URL}/next.png`} />
          </button>
          <div
            className={cx({
              quest__activeTab: true,
              'quest__activeTab--first': currentTab === 0,
              'quest__activeTab--second': currentTab === 1,
              'quest__activeTab--third': currentTab === 2,
            })}
          />
          {tabs.map((tabIcon, index) => (
            <Img
              key={index}
              className={cx({
                quest__tabBtn: true,
                'P-R': true,
                'Cr-P': true,
                'Bs-Cb': true,
                'quest__tabBtn--active': currentTab === index,
              })}
              src={`${S3_ICON_URL}/${tabIcon}.png`}
              onClick={() => {
                this.handleTabClick(index)
              }}
            />
          ))}
        </div>

        <div className="quest__sections">{section}</div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  currentTypes: selectCurrentTypes(),
  currentDescriptives: selectCurrentDescriptives(),
  info: selectInfo(),
})

const actions = {
  updateExpand,
}

export default compose(injectIntl, connect(selectors, actions))(Quest)
