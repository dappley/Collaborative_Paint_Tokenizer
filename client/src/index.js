import './index.css';
import New_Lobby from './Pages/New_Lobby/New_Lobby';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './helper/serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <New_Lobby />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();