import React, { Component, PropTypes, Children } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { compose } from 'redux'
import { connect } from 'react-redux'
import cx from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { updateVisibility } from 'containers/QuestPage/actions'
import messages from 'containers/QuestPage/messages'
import Img from 'components/Img'
import { DescriptiveSection, PlaceSection, TypeSection } from '../Sections'
import './style.scss'

class Quest extends Component {
  static propTypes = {
    className: PropTypes.string,
    updateVisibility: PropTypes.func,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = { currentTab: 0 }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeypress)
  }

  componentWillUnmount() {
    window.addEventListener('keydown', this.handleKeypress)
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
  }

  handleNextBtnClick = () => {
    const { currentTab } = this.state
    this.handleTabClick((currentTab + 1) % 3)
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
          <div className="quest__divider"></div>
          <button className="quest__nextBtn" onClick={this.handleNextBtnClick}>{ formatMessage(messages.next) }
            <Img src={`${CLOUDINARY_ICON_URL}/next.png`} />
          </button>
          <div
            className={cx({
              quest__activeTab: true,
              'quest__activeTab--first': currentTab === 0,
              'quest__activeTab--second': currentTab === 1,
              'quest__activeTab--third': currentTab === 2 }
            )}
          />
          { tabs.map((tabIcon, index) => (
            <Img
              key={index}
              className={cx({
                quest__tabBtn: true,
                'quest__tabBtn--active': currentTab === index,
              })}
              src={`${CLOUDINARY_ICON_URL}/${tabIcon}.png`}
              onClick={() => { this.handleTabClick(index) }}
            />
          ))}
        </div>

        <div className="quest__sections">
          {section}
        </div>
      </div>
    )
  }
}

const actions = {
  updateVisibility,
}

export default compose(
  injectIntl,
  connect(null, actions),
)(Quest)
