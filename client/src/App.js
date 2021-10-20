import Container from './components/container/Container';
import React, { useState } from 'react';
import './App.css';

const { uuid } = require('uuidv4');

function App() {
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
    <div className="App">
      {!showPaint ? (
        <div className="lobby">
          <header>Welcome to collaborative paint and tokenizer!</header>
          {/* <h4>{room}</h4> */}
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
        </div>
      ) : (
        <Container room={(joinOrStart===true) ? room : uuidv4} username={username} artworkTitle={artworkTitle} />
      )}
    </div>
  );
}

export default App;
