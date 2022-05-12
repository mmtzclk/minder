import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
* {
    margin: 0;
padding: 0;
box-sizing: border-box;
}
body{
    font-family: 'Noto Sans', sans-serif;
}
a{
    text-decoration: none;
    color:inherit;
}

@media screen and (min-width: 426px) {
  ::-webkit-scrollbar {
    width: 20px;
    height:100%;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  }



`;

export default GlobalStyle;
