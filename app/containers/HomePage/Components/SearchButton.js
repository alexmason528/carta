import React, { PropTypes, Children } from 'react';
import styled, { css } from 'styled-components';

const buttonStyles = css`
  cursor: pointer;
  position: absolute;
  z-index: 10; 
  margin: 6px; 
  top: 40px;
  box-sizing: content-box;

  img {
    width: 12px; 
    height: 12px; 
    padding: 5px; 
    border-radius: 20px; 
    box-shadow: 0 0 7px rgba(0,0,0,0.4); 
    background: #fff; 
    display: block; 
    margin: 8px; 
    opacity: 0.75; 
    cursor: pointer; 
    border: 1px solid transparent;
  }
  
`;

const StyledButton = styled.div`${buttonStyles}`;

function SearchButton(props) {
  // Render an anchor tag

  const button = (
    <StyledButton onClick={props.onClick}>
      <img src="http://carta.guide/icon/search.png" role="presentation" />
    </StyledButton>
  );
  // If the Button has a handleRoute prop, we want to render a button

  return button;
}

SearchButton.propTypes = {
  onClick: PropTypes.func,
};

export default SearchButton;
