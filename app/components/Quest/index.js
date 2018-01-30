import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { compose } from 'redux'
import { connect } from 'react-redux'
import cx from 'classnames'
import { createStructuredSelector } from 'reselect'
import { SET_QUEST } from 'containers/QuestPage/constants'
import {
  updateExpand,
  placeClick,
  typeClick,
  typeAnythingClick,
  typeSearchExpChange,
  descriptiveClick,
  descriptiveStarClick,
  descriptiveAnythingClick,
  descriptiveSearchExpChange,
} from 'containers/QuestPage/actions'
import {
  selectInfo,
  selectPlaces,
  selectTypes,
  selectCurrentTypes,
  selectTypeSearchExpanded,
  selectDescriptives,
  selectCurrentDescriptives,
  selectDescriptiveSearchExpanded,
} from 'containers/QuestPage/selectors'
import messages from 'containers/QuestPage/messages'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'
import { DescriptiveSection, PlaceSection, TypeSection } from '../Sections'
import './style.scss'

class Quest extends Component {
  static propTypes = {
    updateExpand: PropTypes.func,
    placeClick: PropTypes.func,
    typeClick: PropTypes.func,
    typeAnythingClick: PropTypes.func,
    typeSearchExpChange: PropTypes.func,
    descriptiveClick: PropTypes.func,
    descriptiveStarClick: PropTypes.func,
    descriptiveAnythingClick: PropTypes.func,
    descriptiveSearchExpChange: PropTypes.func,
    places: PropTypes.array,
    types: PropTypes.array,
    currentTypes: PropTypes.object,
    descriptives: PropTypes.array,
    currentDescriptives: PropTypes.object,
    info: PropTypes.object,
    dExpanded: PropTypes.bool,
    tExpanded: PropTypes.bool,
    intl: intlShape.isRequired,
    className: PropTypes.string,
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

    if (status === SET_QUEST) {
      if ((currentTypes.all || currentTypes.includes.length > 0) && (currentDescriptives.all || currentDescriptives.includes.length > 0 || currentDescriptives.stars.length > 0)) {
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
    const {
      intl: { formatMessage },
      info,
      places,
      types,
      currentTypes,
      descriptives,
      currentDescriptives,
      dExpanded,
      tExpanded,
      placeClick,
      typeClick,
      typeAnythingClick,
      typeSearchExpChange,
      descriptiveClick,
      descriptiveStarClick,
      descriptiveAnythingClick,
      descriptiveSearchExpChange,
    } = this.props

    let section
    if (currentTab === 0) {
      const data = { places, placeClick }
      section = <PlaceSection {...data} />
    } else if (currentTab === 1) {
      const data = { info, types, expanded: tExpanded, currentTypes, typeClick, typeAnythingClick, typeSearchExpChange }
      section = <TypeSection {...data} />
    } else {
      const data = {
        info,
        descriptives,
        currentDescriptives,
        expanded: dExpanded,
        descriptiveClick,
        descriptiveStarClick,
        descriptiveAnythingClick,
        descriptiveSearchExpChange,
      }
      section = <DescriptiveSection {...data} />
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
  info: selectInfo(),
  places: selectPlaces(),
  types: selectTypes(),
  currentTypes: selectCurrentTypes(),
  descriptives: selectDescriptives(),
  currentDescriptives: selectCurrentDescriptives(),
  dExpanded: selectDescriptiveSearchExpanded(),
  tExpanded: selectTypeSearchExpanded(),
})

const actions = {
  updateExpand,
  placeClick,
  typeClick,
  typeAnythingClick,
  typeSearchExpChange,
  descriptiveClick,
  descriptiveStarClick,
  descriptiveAnythingClick,
  descriptiveSearchExpChange,
}

export default compose(injectIntl, connect(selectors, actions))(Quest)
