import "./styles/index.css";
import React from 'react';
import ReactDOM from 'react-dom';
import App from "./app/App";

const appContainer = document.querySelector("#app-container");
ReactDOM.render(React.createElement(App), appContainer);
