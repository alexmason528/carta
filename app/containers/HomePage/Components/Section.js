import React, { PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';

import Button from './Button';
import './style.scss';

export class Section extends React.Component {
  constructor() {
    super();

    this.state = {
      page: 1,
    };
  }

  tabClicked = (tab) => {
    this.setState({
      page: tab,
    });
  }

  render() {
    const { page } = this.state;

    let tabStyle;

    if (page === 1) {
      tabStyle = { left: 0 };
    } else if (page === 2) {
      tabStyle = { left: '28px' };
    } else {
      tabStyle = { left: '56px' };
    }

    return (
      <div className="section">
        <div className="tabs">
          <div className="line"></div>
          <div className="tab" style={tabStyle}></div>
          <img className="t1 active" src="http://carta.guide/icon/quest/marker.png" role="presentation" onClick={() => { this.tabClicked(1); }} />
          <img className="t2" src="http://carta.guide/icon/quest/check.png" role="presentation" onClick={() => { this.tabClicked(2); }} />
          <img className="t3" src="http://carta.guide/icon/quest/star.png" role="presentation" onClick={() => { this.tabClicked(3); }} />
        </div>

        <div className="pages">
          <div className="page" style={{ display: (page === 1) ? 'block' : 'none' }}>
            <h1>In</h1>
            <input />
            <Button
              active={1}
              onClick={() => {}}
            >
              Utrecht
            </Button>
            <Button
              active={1}
              onClick={() => {}}
            >
              Gelderland
            </Button>
          </div>

          <div className="page" style={{ display: (page === 2) ? 'block' : 'none' }}>
            <h1>Find</h1>
            <input />
            <Button
              active={1}
              onClick={() => {}}
            >
              Amsterdam
            </Button>
            <Button
              active={1}
              onClick={() => {}}
            >
              Rotterdam
            </Button>
            <Button
              active={1}
              onClick={() => {}}
            >
              Utrecht
            </Button>
            <Button
              active={1}
              onClick={() => {}}
            >
              Gelderland
            </Button>
          </div>

          <div className="page" style={{ display: (page === 3) ? 'block' : 'none' }}>
            <h1>Known For</h1>
            <input />
            <Button
              active={1}
              onClick={() => {}}
            >
              Amsterdam
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Section.propTypes = {
};

export default Section;
