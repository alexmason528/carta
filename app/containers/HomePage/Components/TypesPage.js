import React, { PropTypes, Children } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { List, is } from 'immutable';
import { Button, StarButton } from './Buttons';
import { fetchRecommendations, typeSelect } from '../actions';
import './style.scss';

export class TypesPage extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      types: [],
      expanded: 1,
      anything: 0,
      search: '',
    };
  }

  componentWillMount() {
    this.initializeState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initializeState(nextProps);
  }

  componentWillUpdate(nextProps, nextState) {
    let closable = 0;
    nextState.types.map((type) => {
      if (type.active === 1) closable = 1;
    });

    if (nextProps.className !== this.props.className) {
      nextState.expanded = 1 - closable;
    }

    setTimeout(() => {
      this.searchInput.focus();
    }, 500);
  }

  initializeState(props) {
    this.setState({
      types: props.types,
      anything: props.typesAll,
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

    this.props.typeSelect('anything', null, newAnything, this.props.questIndex);
    this.props.fetchRecommendations();
  }

  inputChangeHandler = (text) => {
    this.setState({
      search: text,
    });
  }

  typeClickHandler = (typeName) => {
    const { types, expanded, anything, search } = this.state;

    let newTypes = types.map((type, index) => {
      const { name, visible, active } = type;
      if (name === typeName) {
        const newActive = active === 1 ? 0 : 1;
        let newVisible = visible;

        if (anything === 0 && expanded === 1) newVisible = newActive;

        this.props.typeSelect(name, newVisible, newActive, this.props.questIndex);
        return { name: name, visible: newVisible, active: newActive };
      }
      return type;
    });

    this.setState({
      types: newTypes,
    });

    this.props.fetchRecommendations();
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
      'type-search': true,
      invisible: expanded === 0,
    });

    const filteredClass = classNames({
      filtered: true,
      show: expanded === 1 || (expanded === 0 && anything === 0),
    });

    const excludedClass = classNames({
      excluded: true,
      show: anything === 1 && expanded === 0 && excludedTypes.length > 0 && excludedTypes.length !== types.length,
    });

    return (
      <div className={this.props.className}>
        <h1>Show Me</h1>
        <img className={searchBtnClass} src="https://carta.guide/icon/search.png" onClick={() => { this.expandHandler(1); }} role="presentation" />
        <img className={closeBtnClass} src="https://carta.guide/icon/back.png" onClick={() => { this.expandHandler(0); }} role="presentation" />
        <input ref={(input) => { this.searchInput = input; }} className={searchInputClass} onChange={(evt) => { this.inputChangeHandler(evt.target.value); }} />
        <div className="suggestion">
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
            <div className="except">ONLY IGNORING</div>
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
      </div>
    );
  }
}

TypesPage.propTypes = {
  className: PropTypes.string,
  types: PropTypes.array,
  questIndex: PropTypes.number,
  typeSelect: PropTypes.func,
  fetchRecommendations: PropTypes.func,
};


export function mapDispatchToProps(dispatch) {
  return {
    typeSelect: (name, visible, active, questIndex) => dispatch(typeSelect(name, visible, active, questIndex)),
    fetchRecommendations: () => dispatch(fetchRecommendations()),
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(TypesPage);
