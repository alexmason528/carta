import styled from 'styled-components';

const MapBlock = styled.div`
  position:absolute; 
  top:0; 
  bottom:0; 
  left:260px; 
  width:calc(100% - 260px);
  transition: linear 0.1s;
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
  ScoreBoardBlock,
};
