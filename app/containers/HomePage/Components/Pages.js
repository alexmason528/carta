import React, { PropTypes, Children } from 'react';
import classNames from 'classnames';
import { Button, StarButton } from './Buttons';
import './style.scss';

class InPage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      areas: [
        'Netherlands',
        'Amsterdam',
        'Antwerpen',
        'Brugge',
        'Den Haag',
        'Haarlem',
        'Delft',
        'Groningen',
        'Leiden',
        'Texel',
        'Maastricht',
        'Brabant',
        'Gelderland',
      ],
      search: '',
      selectedArea: '',
    };
  }

  areaClickHandler = (area) => {
    this.setState({
      selectedArea: area,
    });
  }

  inputChangeHandler = (text) => {
    this.setState({
      search: text,
    });
  }

  render() {
    const { areas, search, selectedArea } = this.state;

    let filteredAreas;
    if (search === '') filteredAreas = areas;
    else filteredAreas = areas.filter((area) => area.toLowerCase().indexOf(search) !== -1);

    return (
      <div className={this.props.className}>
        <h1>In</h1>
        <input className="search-input" onChange={(evt) => { this.inputChangeHandler(evt.target.value); }} />
        { filteredAreas.map((area, index) => <button className="area-button" key={index} onClick={() => { this.areaClickHandler(area); }}>{area}</button>) }
      </div>
    );
  }
}

class FindPage extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      types: [
        { name: 'Regions', visible: 0, active: 1 },
        { name: 'Places to visit', visible: 0, active: 1 },
        { name: 'Activities', visible: 0, active: 1 },
        { name: 'Places to eat', visible: 0, active: 1 },
        { name: 'Nightspots', visible: 0, active: 1 },
        { name: 'Shops', visible: 0, active: 1 },
      ],
      expanded: 0,
      anything: 1,
      search: '',
    };
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

class KnownForPage extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      types: [
        { name: 'Good food', star: 0, visible: 0, active: 1 },
        { name: 'Music', star: 0, visible: 0, active: 1 },
        { name: 'Live music', star: 0, visible: 0, active: 1 },
        { name: 'Swimming', star: 0, visible: 0, active: 1 },
        { name: 'Much food', star: 0, visible: 0, active: 1 },
        { name: 'Burgers', star: 0, visible: 0, active: 1 },
        { name: 'Midnight service', star: 0, visible: 0, active: 1 },
        { name: 'Conscious food', star: 0, visible: 0, active: 1 },
        { name: 'Snacks', star: 0, visible: 0, active: 1 },
        { name: 'Bacon', star: 0, visible: 0, active: 1 },
        { name: 'Grapes', star: 0, visible: 0, active: 1 },
        { name: 'Ham', star: 0, visible: 0, active: 1 },
        { name: 'Hash Browns', star: 0, visible: 0, active: 1 },
      ],
      expanded: 0,
      anything: 1,
      search: '',
    };
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
    let newTypes = types.map((type) => ({ name: type.name, star: newAnything === 0 ? 0 : type.star, visible: newAnything, active: newAnything }));

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
      const { name, star, visible, active } = type;
      if (name === typeName) {
        const newActive = active === 1 ? 0 : 1;
        let newVisible = visible;

        if (anything === 0 && expanded === 1) newVisible = newActive;


        return { name: name, star: 0, visible: newVisible, active: newActive };
      }
      return type;
    });

    this.setState({
      types: newTypes,
    });
  }

  typeStarClickHandler = (typeName) => {
    let types = [...this.state.types];

    let newTypes = types.map((type, index) => {
      const { name, star, visible, active } = type;
      if (name === typeName) {
        return { name: name, star: star === 1 ? 0 : 1, visible: visible, active: active };
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
              const { name, star, visible, active } = type;
              let starButton;

              if (expanded === 1) {
                starButton = (
                  <StarButton
                    active={active}
                    star={star}
                    onClick={() => { this.typeClickHandler(name); }}
                    onStarClick={() => { this.typeStarClickHandler(name); }}
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
                    onClick={() => { this.typeClickHandler(name); }}
                    onStarClick={() => { this.typeStarClickHandler(name); }}
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
            excludedTypes.map((type, index) => {
              const { name, star, visible, active } = type;
              return (
                <StarButton
                  active={active}
                  star={star}
                  onClick={() => { this.typeClickHandler(name); }}
                  onStarClick={() => { this.typeStarClickHandler(name); }}
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

InPage.propTypes = {
  className: PropTypes.string,
};

FindPage.propTypes = {
  className: PropTypes.string,
};

KnownForPage.propTypes = {
  className: PropTypes.string,
};

export {
  InPage,
  FindPage,
  KnownForPage,
};
