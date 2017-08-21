import React, { PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';

import Section from './Section';
import './style.scss';

function MapBlock(props) {
  return (
    <div className={props.className}>
      {Children.toArray(props.children)}
    </div>
  );
}

function ScoreBoardBlock(props) {
  return (
    <div className="scoreboard-block">
      {Children.toArray(props.children)}
    </div>
  );
}

class QuestBlock extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      sections: [1],
      selectedIndex: 0,
    };
  }

  resetState = () => {
    this.setState({
      sections: [1],
      selectedIndex: 0,
    });
  }

  sectionAddHandler = () => {
    this.setState({
      sections: [...this.state.sections, 1],
    });
  }

  sectionSelectHandler = (index) => {
    this.setState({
      selectedIndex: index,
    });
  }

  sectionRemoveHandler = (evt, index) => {
    evt.preventDefault();
    const selectedIndex = this.state.selectedIndex;

    if (selectedIndex === index || this.state.sections.length === 1) return;

    let newSections = this.state.sections.filter((section, sIndex) => sIndex !== index);
    let newSelectedIndex = (index > selectedIndex) ? selectedIndex : selectedIndex - 1;

    this.setState({
      sections: newSections,
      selectedIndex: newSelectedIndex,
    });
  }

  render() {
    const { sections, selectedIndex } = this.state;

    return (
      <div className={this.props.className}>
        <div className="buttons">
          <button className="minimize" onClick={() => { this.props.minimizeClicked(); }}><div></div></button>
          <button className="close" onClick={() => { this.resetState(); this.props.closeClicked(); }}><img src="http://carta.guide/icon/close.png" role="presentation" /></button>
        </div>
        <div className="list">
          {
            sections.map((section, index) => {
              const sectionTabClass = classNames({
                item: true,
                on: index === selectedIndex,
              });
              return (
                <button
                  className={sectionTabClass}
                  key={index}
                  onClick={() => { this.sectionSelectHandler(index); }}
                  onContextMenu={(evt) => { this.sectionRemoveHandler(evt, index); }}
                >
                  {index + 1}
                </button>
              );
            })
          }
          <button className="add-section" onClick={this.sectionAddHandler}>+</button>
        </div>
        <div className="sections">
          {
            sections.map((section, index) => {
              const sectionClass = classNames({
                section: true,
                show: index === selectedIndex,
              });
              return (
                <Section key={index} className={sectionClass}>
                  {index}
                </Section>

              );
            })
          }
        </div>
      </div>
    );
  }
}

MapBlock.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
};

ScoreBoardBlock.propTypes = {
  children: PropTypes.node.isRequired,
};

QuestBlock.propTypes = {
  minimizeClicked: PropTypes.func.isRequired,
  closeClicked: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export {
  MapBlock,
  ScoreBoardBlock,
  QuestBlock,
};
