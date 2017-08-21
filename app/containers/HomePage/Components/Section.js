import React, { PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';

import { InPage, FindPage, KnownForPage } from './Pages';
import './style.scss';

export class Section extends React.Component {
  constructor() {
    super();

    this.state = {
      currentTab: 1,
    };
  }

  tabClicked = (tab) => {
    this.setState({
      currentTab: tab,
    });
  }

  render() {
    const { currentTab } = this.state;

    const tabClass = classNames({
      tab: true,
      first: currentTab === 1,
      second: currentTab === 2,
      third: currentTab === 3,
    });

    const inTabClass = classNames({
      'in-tab': true,
      active: currentTab === 1,
    });

    const findTabClass = classNames({
      'find-tab': true,
      active: currentTab === 2,
    });

    const knownForTabClass = classNames({
      'known-for-tab': true,
      active: currentTab === 3,
    });

    const inPageClass = classNames({
      page: true,
      hidden: currentTab !== 1,
    });

    const findPageClass = classNames({
      page: true,
      hidden: currentTab !== 2,
    });

    const knownForPageClass = classNames({
      page: true,
      hidden: currentTab !== 3,
    });

    return (
      <div className={this.props.className}>
        <div className="tabs">
          <div className="line"></div>
          <div className={tabClass}></div>
          <img className={inTabClass} src="http://carta.guide/icon/quest/marker.png" role="presentation" onClick={() => { this.tabClicked(1); }} />
          <img className={findTabClass} src="http://carta.guide/icon/quest/check.png" role="presentation" onClick={() => { this.tabClicked(2); }} />
          <img className={knownForTabClass} src="http://carta.guide/icon/quest/star.png" role="presentation" onClick={() => { this.tabClicked(3); }} />
        </div>

        <div className="pages">
          <InPage className={inPageClass} />
          <FindPage className={findPageClass} />
          <KnownForPage className={knownForPageClass} />
        </div>
      </div>
    );
  }
}

Section.propTypes = {
  className: PropTypes.string,
};

export default Section;
