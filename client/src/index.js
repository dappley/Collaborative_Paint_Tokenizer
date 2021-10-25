import './index.css';
import Lobby from './Pages/Lobby/Lobby';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './helper/serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Lobby />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();