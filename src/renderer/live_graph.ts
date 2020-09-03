import "./styles/index.css";
import React from 'react';
import ReactDOM from 'react-dom';
import LiveGraph from "./app/LiveGraph";

const appContainer = document.querySelector("#app-container");
ReactDOM.render(React.createElement(LiveGraph), appContainer);
