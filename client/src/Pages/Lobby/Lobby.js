import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PaintBoard from '../PaintBoard/container/Container';
import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import '../../App.css';
import getLinkType from '../../helper/getLinkType';
import Tokenizer from '../Tokenizer/Tokenizer';

function Lobby() {
  const [uuidv4] = useState(uuid);
  const [linkType, setLinkType] = useState("");
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [showPaint, setShowPaint] = useState(false);
  const [artworkTitle, setArtworkTitle] = useState("");
  const [join, setJoin] = useState(false);

  var id = "/room=" + uuidv4;
  var paintBoard_link = "/PaintBoard" + "/room=" + uuidv4;

  useEffect((url = window.location.href) => {
    let linkType = getLinkType(url);
    setLinkType(linkType);
    if (linkType === "PaintBoard" || linkType === "Tokenizer") {
      setShowPaint(true);
    }
  });

  function startRoom() {
    if (username !== "" && artworkTitle != "") {
      setShowPaint(true);
    }
  };

  function joinRoom() {
    if (username !== "" && room !== "") {
      setShowPaint(true);
      setJoin(true);
    }
  };

  return (
    <Router>
      {!showPaint ? (
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
            <button onClick={joinRoom}>
              <Link to={"/PaintBoard"}>Join a Room</Link>
            </button>
            <button onClick={startRoom}>
              <Link to={"/PaintBoard"}>Create a Room</Link>
            </button>
          </div>
        </div>
      ) : (
        <Switch>
          <Route path={"/PaintBoard"}>
            <PaintBoard room={(join === true) ? room : uuidv4} username={username} artworkTitle={artworkTitle}/>
          </Route>
          <Route path="/Tokenizer">
            <Tokenizer />
          </Route>
        </Switch>
        
      )}
    </Router>
  );
}

export default Lobby;
