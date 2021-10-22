import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PaintBoard from '../PaintBoard/container/Container';
import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import '../../App.css';
import getLinkInfo from '../../helper/getLinkInfo';
import Tokenizer from '../Tokenizer/Tokenizer';
import io from 'socket.io-client';

function Lobby() {
  const [uuidv4] = useState(uuid);
  const [linkType, setLinkType] = useState("");
  const [room, setRoom] = useState("");
  const [roomExist, setRoomExist] = useState(false);
  const [username, setUsername] = useState("");
  const [showPaint, setShowPaint] = useState(false);
  const [artworkTitle, setArtworkTitle] = useState("");
  const [join, setJoin] = useState(false);
  const [paintBoardLink, setPaintBoardLink] = useState("/PaintBoard" + "/room=" + uuidv4);

  const socket = io.connect("http://localhost:5000");

  useEffect((url = window.location.href) => {
    let linkInfo = getLinkInfo(url);
    setLinkType(linkInfo[0]);
    setRoom(linkInfo[1]);
    console.log(linkInfo[0]);
    console.log(linkInfo[1]);
    if (linkType === "PaintBoard" || linkType === "Tokenizer") {
      // #TODO check if the room ID exists in socket.io
      // if set paintBoardLink to the current link; otherwise return.
      console.log("I am here");
      socket.on("connect", () => {
        console.log("Now I am here");
        socket.emit("checkRoomID_call", room);
        socket.on("checkRoomID_return", (isExist) => {
        console.log("isExist:", isExist);
        if (isExist) {
          console.log("This room ID does exists!");
          setRoomExist(true);
        } else {
          console.log("This room ID does not exist.");
        }
        });
        console.log("I am also here");
      });
      if (roomExist) {
        console.log("Connecting to the room...");
        setPaintBoardLink("/PaintBoard/room=" + room);
        setShowPaint(true);
        setJoin(true);
      } else {
        console.log("Redirecting to lobby...");
      }
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
              <Link to={paintBoardLink}>Join a Room</Link>
            </button>
            <button onClick={startRoom}>
              <Link to={paintBoardLink}>Create a Room</Link>
            </button>
          </div>
        </div>
      ) : (
        <Switch>
          <Route path={paintBoardLink}>
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
