import React, { PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { questAdd, questSelect, questRemove } from '../actions';
import InPage from './InPage';
import FindPage from './FindPage';
import KnownForPage from './KnownForPage';
import Quest from './Quest';
import './style.scss';

export class QuestBlock extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      quests: [],
      selectedIndex: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      quests: nextProps.questInfo,
      selectedIndex: nextProps.currentQuestIndex,
    });
  }

  questAddHandler = () => {
    this.props.questAdd();
  }

  questSelectHandler = (index) => {
    this.props.questSelect(index);
  }

  questRemoveHandler = (evt, index) => {
    evt.preventDefault();
    const selectedIndex = this.state.selectedIndex;
    if (selectedIndex === index || this.state.quests.length === 1) return;

    this.props.questRemove(index);
  }

  render() {
    const { quests, selectedIndex } = this.state;
    return (
      <div className={this.props.className}>
        <div className="buttons">
          <button className="minimize" onClick={() => { this.props.minimizeClicked(); }}><div></div></button>
          <button className="close" onClick={() => { this.props.closeClicked(); }}><img src="http://carta.guide/icon/close.png" role="presentation" /></button>
        </div>
        <div className="list">
          {
            quests.map((quest, index) => {
              const questTabClass = classNames({
                item: true,
                on: index === selectedIndex,
              });
              return (
                <button
                  className={questTabClass}
                  key={index}
                  onClick={() => { this.questSelectHandler(index); }}
                  onContextMenu={(evt) => { this.questRemoveHandler(evt, index); }}
                >
                  {index + 1}
                </button>
              );
            })
          }
          <button className="add-quest" onClick={this.questAddHandler}>+</button>
        </div>
        <div className="quests">
          {
            quests.map((quest, index) => {
              const questClass = classNames({
                quest: true,
                show: index === selectedIndex,
              });
              return (
                <Quest key={index} className={questClass} questInfo={quest} questIndex={index} mapViewPortChange={this.props.mapViewPortChange}>
                  {index}
                </Quest>
              );
            })
          }
        </div>
      </div>
    );
  }
}


QuestBlock.propTypes = {
  minimizeClicked: PropTypes.func.isRequired,
  closeClicked: PropTypes.func.isRequired,
  questInfo: PropTypes.object,
  currentQuestIndex: PropTypes.number,
  className: PropTypes.string,
  mapViewPortChange: PropTypes.func,
  questAdd: PropTypes.func,
  questSelect: PropTypes.func,
  questRemove: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    questAdd: () => dispatch(questAdd()),
    questSelect: (index) => dispatch(questSelect(index)),
    questRemove: (index) => dispatch(questRemove(index)),
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(QuestBlock);
