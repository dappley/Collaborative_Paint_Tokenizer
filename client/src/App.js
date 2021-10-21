import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Container from './Pages/PaintBoard/container/Container';
import Tokenizer from './Pages/Tokenizer/Tokenizer';
import Lobby from './Pages/Lobby/Lobby';
import React from 'react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="main">
        <div>
          <button>
            <Link to="/Lobby">Lobby</Link>
          </button>
          <button>
            <Link to="/PaintBoard">Paint Board</Link>
          </button>
          <button>
            <Link to="/Tokenizer">Tokenizer</Link>
          </button>
        </div>
      </div>
      
      <Switch>
        <Route path="/Lobby">
          <Lobby />
        </Route>
        <Route path="/PaintBoard">
          <Container />
        </Route>
        <Route path="/Tokenizer">
          <Tokenizer />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
