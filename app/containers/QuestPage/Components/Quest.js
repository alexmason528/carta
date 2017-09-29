import React, { Component, PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PlacesPage from './PlacesPage';
import DescriptivesPage from './DescriptivesPage';
import TypesPage from './TypesPage';

import { updateVisibility } from '../actions';

import '../style.scss';

class Quest extends Component {
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
    // this.props.updateVisibility();
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

    const placesTabClass = classNames({
      'places-tab': true,
      active: currentTab === 0,
    });

    const placesPageClass = classNames({
      page: true,
      'places-page': true,
      hidden: currentTab !== 0,
    });

    const typesTabClass = classNames({
      'types-tab': true,
      active: currentTab === 1,
    });

    const typesPageClass = classNames({
      page: true,
      'types-page': true,
      hidden: currentTab !== 1,
    });

    const descriptivesTabClass = classNames({
      'descriptives-tab': true,
      active: currentTab === 2,
    });

    const descriptivesPageClass = classNames({
      page: true,
      'descriptives-page': true,
      hidden: currentTab !== 2,
    });

    return (
      <div className={this.props.className}>
        <div className="tabs">
          <div className="line"></div>
          <button className="next" onClick={this.nextBtnClicked}>Next<img src="https://carta.guide/icon/next.png" role="presentation" /></button>
          <div className={tabClass}></div>
          <img className={placesTabClass} src="https://carta.guide/icon/quest/marker.png" role="presentation" onClick={() => { this.tabClicked(0); }} />
          <img className={typesTabClass} src="https://carta.guide/icon/quest/check.png" role="presentation" onClick={() => { this.tabClicked(1); }} />
          <img className={descriptivesTabClass} src="https://carta.guide/icon/quest/star.png" role="presentation" onClick={() => { this.tabClicked(2); }} />
        </div>

        <div className="pages">
          <PlacesPage className={placesPageClass} mapViewPortChange={this.props.mapViewPortChange} />
          <TypesPage className={typesPageClass} />
          <DescriptivesPage className={descriptivesPageClass} />
        </div>
      </div>
    );
  }
}

Quest.propTypes = {
  className: PropTypes.string,
  mapViewPortChange: PropTypes.func,
  updateVisibility: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    updateVisibility: () => dispatch(updateVisibility()),
  };
}

const mapStateToProps = null;

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Quest);