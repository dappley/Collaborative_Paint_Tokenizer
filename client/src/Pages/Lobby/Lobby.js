import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PaintBoard from '../PaintBoard/container/Container';
import React, { useState } from 'react';
import '../../App.css';

const { uuid } = require('uuidv4');

function Lobby() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [artworkTitle, setArtworkTitle] = useState("");

  const [uuidv4, setuuidv4]= useState(uuid);
  const [showPaint, setShowPaint] = useState(false);
  const [joinOrStart, setJoinOrStart] = useState(false);

  function startRoom() {
    if (username !== "" && artworkTitle != "") {
      setShowPaint(true);
    }
  };

  function joinRoom() {
    if (username !== "" && room !== "") {
      setShowPaint(true);
      setJoinOrStart(true);
    }
  };

  return (
    <Router>
      <div className="App">
        <div className="lobby">
          <header>Welcome to collaborative paint and tokenizer!</header>
          <input
            type="text"
            placeholder="User Name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Artwork Title"
            onChange={(event) => {
              setArtworkTitle(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join a Room</button>
          <button onClick={startRoom}>Create a Room</button>
          <button>
            <Link to='/PaintBoard'>Paint Board</Link>
          </button>
        </div>
      </div>
      <Switch>
        <Route path='/PaintBoard'>
          <header>{uuidv4}</header>
          <PaintBoard room={uuidv4} username={username} artworkTitle={artworkTitle}/>
        </Route>
      </Switch>
    </Router>
  );
}

export default Lobby;
