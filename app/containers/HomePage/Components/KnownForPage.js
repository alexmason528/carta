import React, { PropTypes, Children } from 'react';
import classNames from 'classnames';
import { Button, StarButton } from './Buttons';

import './style.scss';

export class KnownForPage extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      descriptives: [],
      expanded: 0,
      anything: 1,
      search: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      descriptives: nextProps.descriptives,
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
  }

  inputChangeHandler = (text) => {
    this.setState({
      search: text,
    });
  }

  descriptiveClickHandler = (descriptiveName) => {
    let descriptives = [...this.state.descriptives];
    const anything = this.state.anything;
    const expanded = this.state.expanded;

    let newDescriptives = descriptives.map((descriptive, index) => {
      const { name, star, visible, active } = descriptive;
      if (name === descriptiveName) {
        const newActive = active === 1 ? 0 : 1;
        let newVisible = visible;

        if (anything === 0 && expanded === 1) newVisible = newActive;

        return { name: name, star: 0, visible: newVisible, active: newActive };
      }
      return descriptive;
    });

    this.setState({
      descriptives: newDescriptives,
    });
  }

  descriptiveStarClickHandler = (descriptiveName) => {
    let descriptives = [...this.state.descriptives];

    let newDescriptives = descriptives.map((descriptive, index) => {
      const { name, star, visible, active } = descriptive;
      if (name === descriptiveName) {
        return { name: name, star: star === 1 ? 0 : 1, visible: visible, active: active };
      }
      return descriptive;
    });

    this.setState({
      descriptives: newDescriptives,
    });
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
      show: anything === 1 && expanded === 0 && excludedDescriptives.length > 0,
    });

    return (
      <div className={this.props.className}>
        <h1>Known For</h1>
        <img className={searchBtnClass} src="http://carta.guide/icon/search.png" onClick={() => { this.expandHandler(1); }} role="presentation" />
        <img className={closeBtnClass} src="http://carta.guide/icon/close.png" onClick={() => { this.expandHandler(0); }} role="presentation" />
        <input className={searchInputClass} onChange={(evt) => { this.inputChangeHandler(evt.target.value); }} />
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
          <h1>EXCLUDING</h1>
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
    );
  }
}

KnownForPage.propTypes = {
  className: PropTypes.string,
  descriptives: PropTypes.array,
};

export default KnownForPage;
