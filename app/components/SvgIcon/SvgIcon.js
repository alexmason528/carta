import React, { Component, PropTypes } from 'react';

const SvgIcon = (props) => {
  const { children, ...other } = props
  return (
    <svg {...other}>{children}</svg>
  );
}

SvgIcon.propTypes = {
  children: PropTypes.node,
  viewBox: PropTypes.string,
}

SvgIcon.defaultProps = {
  viewBox: '0 0 50 50',
}

export default SvgIcon
