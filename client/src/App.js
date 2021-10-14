import './App.css';
// import io from 'socket.io-client';
import React, { useState } from 'react';
import Container from './components/container/Container';

const { uuid } = require('uuidv4');

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  // const [roomId, setRoomId] = useState(null);
  const [showPaint, setShowPaint] = useState(false);
  const [uuidv4/*, setUuidv4*/]= useState(uuid);
  const [joinOrStart, setJoinOrStart] = useState(false);
  // let socket;

  function joinRoom() {
    if (username !== "" && room !== "") {
      //socket = io.connect("http://localhost:5000");
      //socket.emit("join_room", room);
      //socket.emit(room, "data from client")
      // socket.on(tempRoom, (data) => {
      //   console.log(`test data is: ${data}}`);
      //   setInfo(data);
      // });
      //setRoomId(room);
      setShowPaint(true);
      setJoinOrStart(true);
    }
  };

  function startRoom() {
    if (username !== "") {
      setShowPaint(true);
    }
  };

  return (
    <div className="App">
      {!showPaint ? (
        <div className="lobby">
          <header>Welcome to collaborative paint and tokenizer!</header>
          <h4>{room}</h4>
          <input
            type="text"
            placeholder="User Name"
            onChange={(event) => {
              setUsername(event.target.value);
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
        <Container room={(joinOrStart===true) ? room : uuidv4} username={username}/>
      )}
    </div>
  );
}

export default App;
