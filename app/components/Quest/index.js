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
    mapViewPortChange: PropTypes.func,
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
    const { className, mapViewPortChange, intl: { formatMessage } } = this.props

    return (
      <div className={className}>
        <div className="tabs">
          <div className="line"></div>
          <button className="next" onClick={this.handleNextBtnClick}>{ formatMessage(messages.next) }
            <Img src={`${CLOUDINARY_ICON_URL}/next.png`} />
          </button>
          <div className={cx({ tab: true, first: currentTab === 0, second: currentTab === 1, third: currentTab === 2 })}></div>
          <Img className={cx({ 'places-tab': true, active: currentTab === 0 })} src={`${CLOUDINARY_ICON_URL}/marker.png`} onClick={() => { this.handleTabClick(0) }} />
          <Img className={cx({ 'types-tab': true, active: currentTab === 1 })} src={`${CLOUDINARY_ICON_URL}/check.png`} onClick={() => { this.handleTabClick(1) }} />
          <Img className={cx({ 'descriptives-tab': true, active: currentTab === 2 })} src={`${CLOUDINARY_ICON_URL}/star.png`} onClick={() => { this.handleTabClick(2) }} />
        </div>

        <div className="pages">
          <PlaceSection className={cx({ page: true, 'places-page': true, hidden: currentTab !== 0 })} mapViewPortChange={mapViewPortChange} />
          <TypeSection className={cx({ page: true, 'types-page': true, hidden: currentTab !== 1 })} />
          <DescriptiveSection className={cx({ page: true, 'descriptives-page': true, hidden: currentTab !== 2 })} />
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
