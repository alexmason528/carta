import React, { PropTypes, Children } from 'react';
import styled from 'styled-components';
import { css } from 'styled-components';

const buttonStyles = css`
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  font-family:'Open Sans', sans-serif; 
  display:block; 
  border:none; 
  padding:3px 5px; 
  margin:8px; 
  outline:none; 
  text-transform:uppercase; 
  font-weight:400; 
  font-size:13px;

  &:hover {
    background: #00bb00;
    color: #fff;
  }
`;

const StyledButton = styled.button`${buttonStyles}`;

function Button(props) {
  // Render an anchor tag
  let button = (
    <StyledButton onClick={props.onClick}>
      {Children.toArray(props.children)}
    </StyledButton>
  );

  // If the Button has a handleRoute prop, we want to render a button

  return button;
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Button;