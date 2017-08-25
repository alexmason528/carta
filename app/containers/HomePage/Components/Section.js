import React, { PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';

import InPage from './InPage';
import FindPage from './FindPage';
import KnownForPage from './KnownForPage';

import './style.scss';

export class Section extends React.Component {
  constructor() {
    super();
    this.state = {
      currentTab: 0,
    };
  }

  tabClicked = (tab) => {
    this.setState({
      currentTab: tab,
    });
  }

  nextBtnClicked = () => {
    let tab = this.state.currentTab;
    this.setState({
      currentTab: (tab + 1) % 3,
    });
  }

  render() {
    const { currentTab } = this.state;
    const tabClass = classNames({
      tab: true,
      first: currentTab === 0,
      second: currentTab === 1,
      third: currentTab === 2,
    });

    const inTabClass = classNames({
      'in-tab': true,
      active: currentTab === 0,
    });

    const findTabClass = classNames({
      'find-tab': true,
      active: currentTab === 1,
    });

    const knownForTabClass = classNames({
      'known-for-tab': true,
      active: currentTab === 2,
    });

    const inPageClass = classNames({
      page: true,
      hidden: currentTab !== 0,
    });

    const findPageClass = classNames({
      page: true,
      hidden: currentTab !== 1,
    });

    const knownForPageClass = classNames({
      page: true,
      hidden: currentTab !== 2,
    });

    return (
      <div className={this.props.className}>
        <div className="tabs">
          <div className="line"></div>
          <button className="next" onClick={this.nextBtnClicked}>Next<img src="http://carta.guide/icon/next.png" role="presentation" /></button>
          <div className={tabClass}></div>
          <img className={inTabClass} src="http://carta.guide/icon/quest/marker.png" role="presentation" onClick={() => { this.tabClicked(0); }} />
          <img className={findTabClass} src="http://carta.guide/icon/quest/check.png" role="presentation" onClick={() => { this.tabClicked(1); }} />
          <img className={knownForTabClass} src="http://carta.guide/icon/quest/star.png" role="presentation" onClick={() => { this.tabClicked(2); }} />
        </div>

        <div className="pages">
          <InPage className={inPageClass} places={this.props.questInfo.get('places').toJS()} />
          <FindPage className={findPageClass} types={this.props.questInfo.get('types').toJS()} />
          <KnownForPage className={knownForPageClass} descriptives={this.props.questInfo.get('descriptives').toJS()} />
        </div>
      </div>
    );
  }
}

Section.propTypes = {
  className: PropTypes.string,
  questInfo: PropTypes.object.isRequired,
};

export default Section;
