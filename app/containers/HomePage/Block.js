import styled from 'styled-components';

const MapBlock = styled.div`
  position:absolute; 
  top:0; 
  bottom:0; 
  left:170px; 
  width:calc(100% - 170px);
`;

const SearchBlock = styled.div`
  position:relative; 
  color:#222; 
  width:170px; 
  height:100vh; 
  padding:60px 20px; 
  box-sizing:border-box; 
  box-shadow:0 0 7px rgba(0,0,0,0.2);
`;

const ScoreBoardBlock = styled.div`
  right:20px; 
  top:20px; 
  text-align:right; 
  color:#fff; 
  font-weight:900; 
  text-transform:uppercase; 
  position:absolute;
`;

export {
  MapBlock,
  SearchBlock,
  ScoreBoardBlock,
};
