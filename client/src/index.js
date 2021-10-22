import './index.css';
// import App from './App';
// import Lobby from './Pages/Lobby/Lobby';
import New_Lobby from './Pages/New_Lobby/New_Lobby';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './helper/serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    {/* <New_Lobby /> */}
    <New_Lobby />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();