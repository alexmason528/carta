import React, { PropTypes, Children } from 'react';
import classNames from 'classnames';
import { Button, StarButton } from './Buttons';
import './style.scss';

export class FindPage extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      types: [],
      expanded: 0,
      anything: 1,
      search: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      types: nextProps.types,
    });
  }

  expandHandler = (expanded) => {
    let types = [...this.state.types];

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
    const { types, expanded, anything, search } = this.state;
    let newAnything = (anything === 0) ? 1 : 0;
    let newTypes = types.map((type) => ({ name: type.name, visible: newAnything, active: newAnything }));

    this.setState({
      anything: newAnything,
      types: newTypes,
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

  typeClickHandler = (typeName) => {
    let types = [...this.state.types];
    const anything = this.state.anything;
    const expanded = this.state.expanded;

    let newTypes = types.map((type, index) => {
      const { name, visible, active } = type;
      if (name === typeName) {
        const newActive = active === 1 ? 0 : 1;
        let newVisible = visible;

        if (anything === 0 && expanded === 1) newVisible = newActive;

        return { name: name, visible: newVisible, active: newActive };
      }
      return type;
    });

    this.setState({
      types: newTypes,
    });
  }

  render() {
    const { types, expanded, anything, search } = this.state;

    let searchedTypes = [];
    if (search === '') searchedTypes = types;
    else searchedTypes = types.filter((type) => type.name.toLowerCase().indexOf(search) !== -1);

    let visibleCnt = 0;
    let excludedTypes = types.filter((type) => {
      if (type.visible === 1) visibleCnt += 1;
      return type.active === 0;
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
      show: anything === 1 && expanded === 0 && excludedTypes.length > 0,
    });

    return (
      <div className={this.props.className}>
        <h1 >Find</h1>
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
          searchedTypes.map((type, index) => {
            const { name, visible, active } = type;
            let button;

            if (expanded === 1) {
              button = (
                <Button
                  active={active}
                  onClick={() => { this.typeClickHandler(name); }}
                  key={index}
                >
                  {name}
                </Button>
              );
            } else if (visible === 1) {
              button = (
                <Button
                  active={active}
                  onClick={() => { this.typeClickHandler(name); }}
                  key={index}
                >
                  {name}
                </Button>
              );
            }
            return button;
          })
        }
        </div>
        <div className={excludedClass}>
          <h1>EXCLUDING</h1>
          {
            excludedTypes.map((type, index) => {
              const { name, visible, active } = type;
              return (
                <Button
                  active={active}
                  onClick={() => { this.typeClickHandler(name); }}
                  key={index}
                >
                  {name}
                </Button>
              );
            })
          }
        </div>
      </div>
    );
  }
}

FindPage.propTypes = {
  className: PropTypes.string,
  types: PropTypes.array,
};

export default FindPage;
