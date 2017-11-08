import { injectGlobal } from 'styled-components'

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  body {
    font-family: 'Open Sans', sans-serif; 
    font-size: 14.5px; 
    margin: 0; 
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-text-size-adjust: 100%; 
    overflow-x: hidden; 
    font-weight: 300; 
    position: relative;

    // &::-webkit-scrollbar {
    //   width: 10px;
    //   * {
    //     background:transparent;
    //   }
    // }

    // &::-webkit-scrollbar-thumb {
    //   background: rgba(200, 200, 200, 0.7) !important;
    // }
  }

  * {
    font-family: 'Open Sans', sans-serif !important;
    margin:0; 
    padding:0; 
    -webkit-font-smoothing: auto !important;
    -khtml-user-select: none;
    -o-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;  
  }

  @media screen and (orientation:portrait) {
    body {
      font-size: calc(12px + 0.4vh);
    }
  }

  button {
    text-transform: uppercase;
    font-size: 13px;
    cursor: pointer;

    color: rgba(0, 0, 0, 0.7);

    &:hover {
      color: rgba(0, 0, 0, 1);
    }
  }

  button:focus, input:focus {
    outline: none;
  }
`
