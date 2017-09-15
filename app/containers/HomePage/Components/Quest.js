import React, { PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PlacesPage from './PlacesPage';
import DescriptivesPage from './DescriptivesPage';
import TypesPage from './TypesPage';

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

    const typesTabClass = classNames({
      'types-tab': true,
      active: currentTab === 0,
    });

    const typesPageClass = classNames({
      page: true,
      'types-page': true,
      hidden: currentTab !== 0,
    });

    const descriptivesTabClass = classNames({
      'descriptives-tab': true,
      active: currentTab === 1,
    });

    const descriptivesPageClass = classNames({
      page: true,
      'descriptives-page': true,
      hidden: currentTab !== 1,
    });

    const placesTabClass = classNames({
      'places-tab': true,
      active: currentTab === 2,
    });

    const placesPageClass = classNames({
      page: true,
      'places-page': true,
      hidden: currentTab !== 2,
    });

    return (
      <div className={this.props.className}>
        <div className="tabs">
          <div className="line"></div>
          <button className="next" onClick={this.nextBtnClicked}>Next<img src="https://carta.guide/icon/next.png" role="presentation" /></button>
          <div className={tabClass}></div>
          <img className={typesTabClass} src="https://carta.guide/icon/quest/check.png" role="presentation" onClick={() => { this.tabClicked(0); }} />
          <img className={descriptivesTabClass} src="https://carta.guide/icon/quest/star.png" role="presentation" onClick={() => { this.tabClicked(1); }} />
          <img className={placesTabClass} src="https://carta.guide/icon/quest/marker.png" role="presentation" onClick={() => { this.tabClicked(2); }} />
        </div>

        <div className="pages">
          <TypesPage className={typesPageClass} types={this.props.questInfo.get('types').toJS()} typesAll={this.props.questInfo.get('typesAll')} questIndex={this.props.questIndex} />
          <DescriptivesPage className={descriptivesPageClass} descriptives={this.props.questInfo.get('descriptives').toJS()} descriptivesAll={this.props.questInfo.get('descriptivesAll')} questIndex={this.props.questIndex} />
          <PlacesPage className={placesPageClass} places={this.props.questInfo.get('places').toJS()} questIndex={this.props.questIndex} mapViewPortChange={this.props.mapViewPortChange} />
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
