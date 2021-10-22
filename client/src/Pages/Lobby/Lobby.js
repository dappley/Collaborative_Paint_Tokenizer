import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PaintBoard from '../PaintBoard/container/Container';
import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import '../../App.css';
import getLinkInfo from '../../helper/getLinkInfo';
import Tokenizer from '../Tokenizer/Tokenizer';
import io from 'socket.io-client';

let socket;
const CONNECTION_PORT = 'http://localhost:5000';

function Lobby() {
  const [uuidv4] = useState(uuid);
  const [room, setRoom] = useState("");
  // const [username, setUsername] = useState("");
  const [showPaint, setShowPaint] = useState(false);
  const [artworkTitle, setArtworkTitle] = useState("");
  const [join, setJoin] = useState(false);
  const [tokenizerLink, setTokenizerLink] = useState("/Tokenizer/room=" + uuidv4);
  const [paintBoardLink, setPaintBoardLink] = useState("/PaintBoard/room=" + uuidv4);


  useEffect((url = window.location.href) => {
    socket = io.connect(CONNECTION_PORT);
    let linkInfo = getLinkInfo(url);
    if (linkInfo[0] === "PaintBoard" || linkInfo[0] === "Tokenizer") {
      socket.on("connect", () => {
        // #TODO socket.emit & socket.on aren't being called
        socket.emit("checkRoomID_Call", linkInfo[1]);
        socket.on("checkRoomID_Return", (isExist) => {
          if (isExist) {
            console.log("This room ID does exists! :)");
            console.log("Connecting to the room...");
            setPaintBoardLink("/PaintBoard/room=" + linkInfo[1]);
            setTokenizerLink("/Tokenizer/room=" + linkInfo[1]);
            setRoom(linkInfo[1]);
            setShowPaint(true);
            setJoin(true);
          } else {
            console.log("This room ID does not exist. :(");
            console.log("Redirecting to lobby...");
            window.location.reaplce = "localhost:3000/Lobby";
          }
        });
      });
    }
  }, [CONNECTION_PORT]);

  function startRoom() {
    if (/*username !== "" && */artworkTitle != "") {
      setShowPaint(true);
    }
  };

  function joinRoom() {
    if (/*username !== "" && */room !== "") {
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
            {/* <input
              type="text"
              placeholder="User Name"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            /> */}
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
            {console.log(paintBoardLink)}
            {console.log("room:", room)}
            {console.log("join:", join)}
            <PaintBoard room={(join === true) ? room : uuidv4} /*username={username}*/ artworkTitle={artworkTitle}/>
          </Route>
          <Route path={tokenizerLink}>
            <Tokenizer />
          </Route>
        </Switch>
      )}
    </Router>
  );
}

export default Lobby;
