import React, { Component, PropTypes } from 'react';
import './style.scss';

const TextPost = ({ title, username, date, content }) => {
  return (
    <div className="textPost">
      <div className="textPost__title">
        {title}
      </div>
      <div className="textPost__info">
        {username} - CARTA | {date}
      </div>
      <p className="textPost__content">
        {content}
      </p>
    </div>
  );
};

TextPost.propTypes = {
  title: PropTypes.string,
  username: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  date: PropTypes.string,
  content: PropTypes.string,
};

export default TextPost;
