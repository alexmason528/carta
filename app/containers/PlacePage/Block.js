import styled from 'styled-components';

const MapBlock = styled.div`
  position:absolute; 
  top:0; 
  bottom:0; 
  left:260px; 
  width:calc(100% - 260px);
`;

const SearchBlock = styled.div`
  position:relative; 
  color:#222; 
  width:260px; 
  height:100vh; 
  padding:20px 10px 20px 20px;
  box-sizing:border-box; 
  box-shadow:0 0 7px rgba(0,0,0,0.2);
  overflow-y: scroll;
`;

const ScoreBoardBlock = styled.div`
  right:20px; 
  top:20px; 
  text-align:right; 
  color:#000; 
  font-weight:900; 
  text-transform:uppercase; 
  position:absolute;
  display:none;
`;

export {
  MapBlock,
  SearchBlock,
  ScoreBoardBlock,
};
