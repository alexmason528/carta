import React, { PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';

import Section from './Section';
import './style.scss';

export class QuestBlock extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      sectionCount: 1,
    };
  }

  addSection = () => {
    let { sectionCount } = this.state;
    this.setState({
      sectionCount: sectionCount + 1,
    });
  }

  render() {
    const { sectionCount } = this.state;
    return (
      <div className={this.props.className}>
        <div className="buttons">
          <button className="minimize" onClick={this.props.minimizeClicked}><div></div></button>
          <button className="close" onClick={this.props.closeClicked}><img src="http://carta.guide/icon/close.png" role="presentation" /></button>
        </div>
        <div className="list">
          <button className="item">1</button>
          <button className="add-section" onClick={this.addSection}>+</button>
        </div>
        <div className="sections">
          <Section />
        </div>
      </div>
    );
  }
}

QuestBlock.propTypes = {
  // children: PropTypes.node.isRequired,
  minimizeClicked: PropTypes.func.isRequired,
  closeClicked: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default QuestBlock;
