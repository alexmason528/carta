import React, { Component, PropTypes, Children } from 'react'
import styled, { css } from 'styled-components'
import classNames from 'classnames'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'

import { DescriptiveSection, PlaceSection, TypeSection } from '../Sections'

import './style.scss'

export default class Quest extends Component {
  static propTypes = {
    className: PropTypes.string,
    mapViewPortChange: PropTypes.func,
    updateVisibility: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      currentTab: 0,
    }
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
      const tab = this.state.currentTab
      this.handleTabClick((tab + 1) % 3)
    }
  }

  handleTabClick = tab => {
    this.setState({ currentTab: tab })
  }

  handleNextBtnClick = () => {
    const tab = this.state.currentTab
    this.handleTabClick((tab + 1) % 3)
  }

  render() {
    const { currentTab } = this.state
    const { className, mapViewPortChange } = this.props

    const tabClass = classNames({
      tab: true,
      first: currentTab === 0,
      second: currentTab === 1,
      third: currentTab === 2,
    })

    const placesTabClass = classNames({
      'places-tab': true,
      active: currentTab === 0,
    })

    const placesPageClass = classNames({
      page: true,
      'places-page': true,
      hidden: currentTab !== 0,
    })

    const typesTabClass = classNames({
      'types-tab': true,
      active: currentTab === 1,
    })

    const typesPageClass = classNames({
      page: true,
      'types-page': true,
      hidden: currentTab !== 1,
    })

    const descriptivesTabClass = classNames({
      'descriptives-tab': true,
      active: currentTab === 2,
    })

    const descriptivesPageClass = classNames({
      page: true,
      'descriptives-page': true,
      hidden: currentTab !== 2,
    })

    return (
      <div className={className}>
        <div className="tabs">
          <div className="line"></div>
          <button className="next" onClick={this.handleNextBtnClick}>Next
            <img src={`${CLOUDINARY_ICON_URL}/next.png`} role="presentation" />
          </button>
          <div className={tabClass}></div>
          <img className={placesTabClass} src={`${CLOUDINARY_ICON_URL}/marker.png`} role="presentation" onClick={() => { this.handleTabClick(0) }} />
          <img className={typesTabClass} src={`${CLOUDINARY_ICON_URL}/check.png`} role="presentation" onClick={() => { this.handleTabClick(1) }} />
          <img className={descriptivesTabClass} src={`${CLOUDINARY_ICON_URL}/star.png`} role="presentation" onClick={() => { this.handleTabClick(2) }} />
        </div>

        <div className="pages">
          <PlaceSection className={placesPageClass} mapViewPortChange={mapViewPortChange} />
          <TypeSection className={typesPageClass} />
          <DescriptiveSection className={descriptivesPageClass} />
        </div>
      </div>
    )
  }
}
