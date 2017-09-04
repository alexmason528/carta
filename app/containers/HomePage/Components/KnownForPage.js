import React, { PropTypes, Children } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Button, StarButton } from './Buttons';
import { fetchRecommendations, descriptiveSelect } from '../actions';
import './style.scss';

export class KnownForPage extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      descriptives: [],
      expanded: 1,
      anything: 0,
      search: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      descriptives: nextProps.descriptives,
      anything: nextProps.descriptivesAll,
    });
  }

  expandHandler = (expanded) => {
    let descriptives = [...this.state.descriptives];

    this.setState({
      expanded: expanded,
    });

    if (expanded === 0) {
      this.setState({
        search: '',
      });
    }
  }

  anythingClickHandler = () => {
    const { descriptives, expanded, anything, search } = this.state;
    let newAnything = (anything === 0) ? 1 : 0;

    let newDescriptives = descriptives.map((descriptive) => ({ name: descriptive.name, star: newAnything === 0 ? 0 : descriptive.star, visible: newAnything, active: newAnything }));

    this.setState({
      anything: newAnything,
      descriptives: newDescriptives,
    });

    if (newAnything === 0) {
      this.setState({
        expanded: 1,
      });
    }

    this.props.descriptiveSelect('anything', null, null, newAnything, this.props.questIndex);
    this.props.fetchRecommendations();
  }

  inputChangeHandler = (text) => {
    this.setState({
      search: text,
    });
  }

  descriptiveClickHandler = (descriptiveName) => {
    const { descriptives, expanded, anything, search } = this.state;

    let newDescriptives = descriptives.map((descriptive, index) => {
      const { name, star, visible, active } = descriptive;
      if (name === descriptiveName) {
        const newActive = active === 1 ? 0 : 1;
        let newVisible = visible;

        if (anything === 0 && expanded === 1) newVisible = newActive;

        this.props.descriptiveSelect(name, 0, newVisible, newActive, this.props.questIndex);

        return { name: name, star: 0, visible: newVisible, active: newActive };
      }
      return descriptive;
    });

    this.setState({
      descriptives: newDescriptives,
    });

    this.props.fetchRecommendations();
  }

  descriptiveStarClickHandler = (descriptiveName) => {
    let descriptives = [...this.state.descriptives];

    let newDescriptives = descriptives.map((descriptive, index) => {
      const { name, star, visible, active } = descriptive;
      if (name === descriptiveName) {
        const newStar = star === 1 ? 0 : 1;
        this.props.descriptiveSelect(name, newStar, visible, active, this.props.questIndex);

        return { name: name, star: newStar, visible: visible, active: active };
      }
      return descriptive;
    });

    this.setState({
      descriptives: newDescriptives,
    });

    this.props.fetchRecommendations();
  }

  render() {
    const { descriptives, expanded, anything, search } = this.state;

    let searchedDescriptives = [];
    if (search === '') searchedDescriptives = descriptives;
    else searchedDescriptives = descriptives.filter((descriptive) => descriptive.name.toLowerCase().indexOf(search) !== -1);

    let visibleCnt = 0;
    let excludedDescriptives = descriptives.filter((descriptive) => {
      if (descriptive.visible === 1) visibleCnt += 1;
      return descriptive.active === 0;
    });

    const searchBtnClass = classNames({
      search: true,
      invisible: expanded === 1,
    });

    const closeBtnClass = classNames({
      close: true,
      invisible: expanded === 0 || (anything === 0 && visibleCnt === 0),
    });

    const anythingBtnClass = classNames({
      hidden: expanded === 0 && anything === 0,
    });

    const searchInputClass = classNames({
      'search-input': true,
      invisible: expanded === 0,
    });

    const filteredClass = classNames({
      filtered: true,
      show: expanded === 1 || (expanded === 0 && anything === 0),
    });

    const excludedClass = classNames({
      excluded: true,
      show: anything === 1 && expanded === 0 && excludedDescriptives.length > 0 && excludedDescriptives.length !== descriptives.length,
    });

    return (
      <div className={this.props.className}>
        <h1>Known For</h1>
        <img className={searchBtnClass} src="http://carta.guide/icon/search.png" onClick={() => { this.expandHandler(1); }} role="presentation" />
        <img className={closeBtnClass} src="http://carta.guide/icon/back.png" onClick={() => { this.expandHandler(0); }} role="presentation" />
        <input className={searchInputClass} onChange={(evt) => { this.inputChangeHandler(evt.target.value); }} />
        <div className="suggestions">
          <Button
            className={anythingBtnClass}
            active={anything}
            onClick={this.anythingClickHandler}
          >
            Anything
          </Button>
          <div className={filteredClass}>
            {
              searchedDescriptives.map((descriptive, index) => {
                const { name, star, visible, active } = descriptive;
                let starButton;

                if (expanded === 1) {
                  starButton = (
                    <StarButton
                      active={active}
                      star={star}
                      onClick={() => { this.descriptiveClickHandler(name); }}
                      onStarClick={() => { this.descriptiveStarClickHandler(name); }}
                      key={index}
                    >
                      {name}
                    </StarButton>
                  );
                } else if (visible === 1) {
                  starButton = (
                    <StarButton
                      active={active}
                      star={star}
                      onClick={() => { this.descriptiveClickHandler(name); }}
                      onStarClick={() => { this.descriptiveStarClickHandler(name); }}
                      key={index}
                    >
                      {name}
                    </StarButton>
                  );
                }

                return starButton;
              })
          }
          </div>
          <div className={excludedClass}>
            <h1>ONLY IGNORING</h1>
            {
              excludedDescriptives.map((descriptive, index) => {
                const { name, star, visible, active } = descriptive;
                return (
                  <StarButton
                    active={active}
                    star={star}
                    onClick={() => { this.descriptiveClickHandler(name); }}
                    onStarClick={() => { this.descriptiveStarClickHandler(name); }}
                    key={index}
                  >
                    {name}
                  </StarButton>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

KnownForPage.propTypes = {
  className: PropTypes.string,
  descriptives: PropTypes.array,
  questIndex: PropTypes.number,
  descriptiveSelect: PropTypes.func,
  fetchRecommendations: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    descriptiveSelect: (name, star, visible, active, questIndex) => dispatch(descriptiveSelect(name, star, visible, active, questIndex)),
    fetchRecommendations: () => dispatch(fetchRecommendations()),
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(KnownForPage);