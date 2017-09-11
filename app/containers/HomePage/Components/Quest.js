import React, { PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import LookingForPage from './LookingForPage';
import InPage from './InPage';
import InRegionPage from './InRegionPage';

import { updateVisibility } from '../actions';

import './style.scss';

export class Quest extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      currentTab: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeypress);
  }

  componentWillUnmount() {
    window.addEventListener('keydown', this.handleKeypress);
  }

  handleKeypress = (e) => {
    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
    if (e.keyCode === 9) {
      const tab = this.state.currentTab;
      this.tabClicked((tab + 1) % 3);
    }
  }

  tabClicked = (tab) => {
    this.setState({
      currentTab: tab,
    });

    this.props.updateVisibility();
  }

  nextBtnClicked = () => {
    const tab = this.state.currentTab;
    this.tabClicked((tab + 1) % 3);
  }

  render() {
    const { currentTab } = this.state;
    const tabClass = classNames({
      tab: true,
      first: currentTab === 0,
      second: currentTab === 1,
      third: currentTab === 2,
    });

    const lookingForTabClass = classNames({
      'looking-for-tab': true,
      active: currentTab === 0,
    });

    const lookingForPageClass = classNames({
      page: true,
      'looking-for-page': true,
      hidden: currentTab !== 0,
    });

    const inTabClass = classNames({
      'in-tab': true,
      active: currentTab === 1,
    });

    const inPageClass = classNames({
      page: true,
      'in-page': true,
      hidden: currentTab !== 1,
    });

    const inRegionTabClass = classNames({
      'in-region-tab': true,
      active: currentTab === 2,
    });

    const inRegionPageClass = classNames({
      page: true,
      hidden: currentTab !== 2,
    });

    return (
      <div className={this.props.className}>
        <div className="tabs">
          <div className="line"></div>
          <button className="next" onClick={this.nextBtnClicked}>Next<img src="https://carta.guide/icon/next.png" role="presentation" /></button>
          <div className={tabClass}></div>
          <img className={lookingForTabClass} src="https://carta.guide/icon/quest/star.png" role="presentation" onClick={() => { this.tabClicked(0); }} />
          <img className={inTabClass} src="https://carta.guide/icon/quest/check.png" role="presentation" onClick={() => { this.tabClicked(1); }} />
          <img className={inRegionTabClass} src="https://carta.guide/icon/quest/marker.png" role="presentation" onClick={() => { this.tabClicked(2); }} />
        </div>

        <div className="pages">
          <LookingForPage className={lookingForPageClass} descriptives={this.props.questInfo.get('descriptives').toJS()} descriptivesAll={this.props.questInfo.get('descriptivesAll')} questIndex={this.props.questIndex} />
          <InPage className={inPageClass} types={this.props.questInfo.get('types').toJS()} typesAll={this.props.questInfo.get('typesAll')} questIndex={this.props.questIndex} />
          <InRegionPage className={inRegionPageClass} places={this.props.questInfo.get('places').toJS()} questIndex={this.props.questIndex} mapViewPortChange={this.props.mapViewPortChange} />
        </div>
      </div>
    );
  }
}

Quest.propTypes = {
  className: PropTypes.string,
  questInfo: PropTypes.object.isRequired,
  questIndex: PropTypes.number,
  mapViewPortChange: PropTypes.func,
  updateVisibility: PropTypes.func,
};

// export default Quest;

export function mapDispatchToProps(dispatch) {
  return {
    updateVisibility: () => dispatch(updateVisibility()),
  };
}

const mapStateToProps = null;

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Quest);
