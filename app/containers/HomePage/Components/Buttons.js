import React, { PropTypes, Children } from 'react';
import classNames from 'classnames';

function Button(props) {
  let btnClass = classNames({
    'button-wrapper': true,
    active: props.active === 1,
  });

  if (props.className) btnClass = `${btnClass} ${props.className}`;

  return (
    <div className={btnClass}>
      <button onClick={props.onClick}>{Children.toArray(props.children)}</button>
    </div>
  );
}

function StarButton(props) {
  let btnClass = classNames({
    'button-wrapper': true,
    star: props.star === 1,
    active: props.active === 1,
  });

  if (props.className) btnClass = `${btnClass} ${props.className}`;

  return (
    <div className={btnClass}>
      <button onClick={props.onClick}>{Children.toArray(props.children)}</button>
      <img className="star" src="http://carta.guide/icon/quest/star-green.png" onClick={props.onStarClick} role="presentation" />
    </div>
  );
}

function SearchButton(props) {
  return (
    <div className="search-button" onClick={props.onClick}>
      <img src="http://carta.guide/icon/search.png" role="presentation" />
    </div>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.number,
  className: PropTypes.string,
};

StarButton.propTypes = {
  onClick: PropTypes.func,
  onStarClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  active: PropTypes.number,
  star: PropTypes.number,
  className: PropTypes.string,
};

SearchButton.propTypes = {
  onClick: PropTypes.func,
};

export {
  Button,
  StarButton,
  SearchButton,
};
