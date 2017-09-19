import React, { PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetchRecommendations, questAdd, questSelect, questRemove } from '../actions';
import { makeSelectQuests, makeSelectCurrentQuestIndex } from '../selectors';
import Quest from './Quest';
import './style.scss';

export class QuestBlock extends React.PureComponent {
  questAddHandler = () => {
    this.props.questAdd();
  }

  questSelectHandler = (index) => {
    this.props.questSelect(index);
    this.props.fetchRecommendations();
  }

  questRemoveHandler = (evt, index) => {
    evt.preventDefault();
    const { currentQuestIndex, quests } = this.props;
    if (currentQuestIndex === index || quests.length === 1) return;
    this.props.questRemove(index);
  }

  render() {
    const { quests, currentQuestIndex } = this.props;

    return (
      <div className={this.props.className}>
        <div className="buttons">
          <button className="minimize" onClick={() => { this.props.minimizeClicked(); }}><img src="https://carta.guide/icon/min.png" role="presentation" /></button>
          <button className="close" onClick={() => { this.props.closeClicked(); }}><img src="https://carta.guide/icon/close.png" role="presentation" /></button>
        </div>
        <div className="list">
          {
            quests.map((quest, index) => {
              const questTabClass = classNames({
                item: true,
                on: index === currentQuestIndex,
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
                show: index === currentQuestIndex,
              });
              return (
                <Quest key={index} className={questClass} mapViewPortChange={this.props.mapViewPortChange}>
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
  quests: PropTypes.object,
  currentQuestIndex: PropTypes.number,
  className: PropTypes.string,
  mapViewPortChange: PropTypes.func,
  fetchRecommendations: PropTypes.func,
  questAdd: PropTypes.func,
  questSelect: PropTypes.func,
  questRemove: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    questAdd: () => dispatch(questAdd()),
    questSelect: (index) => dispatch(questSelect(index)),
    questRemove: (index) => dispatch(questRemove(index)),
    fetchRecommendations: () => dispatch(fetchRecommendations()),
  };
}

const mapStateToProps = createStructuredSelector({
  quests: makeSelectQuests(),
  currentQuestIndex: makeSelectCurrentQuestIndex(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(QuestBlock);
