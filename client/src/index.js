import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './helper/serviceWorker';
import Container from './components/container/Container.jsx'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();