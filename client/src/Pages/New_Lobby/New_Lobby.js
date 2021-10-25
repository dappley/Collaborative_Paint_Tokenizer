import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PaintBoard from '../PaintBoard/container/Container';
import getLinkInfo from '../../helper/getLinkInfo';
import Tokenizer from '../Tokenizer/Tokenizer';
import io from 'socket.io-client';
import React from 'react';
import uuid from 'uuid';
import '../../App.css';

let socket;
const CONNECTION_PORT = 'http://localhost:5000';

class New_Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: "",
            artworkTitle: "",
            showPaint: false,
            uuidv4: uuid.v4(),
            tokenizerLink: "",
            paintBoardLink: "",
        };
        this.setArtworkTitle = this.setArtworkTitle.bind(this);
        this.startRoom = this.startRoom.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.setRoom = this.setRoom.bind(this);
    }

    componentWillMount(url = window.location.href) {
        socket = io.connect(CONNECTION_PORT);
        this.setState({paintBoardLink: "/PaintBoard/room=" + this.state.uuidv4});
        this.setState({tokenizerLink: "/Tokenizer/room=" + this.state.uuidv4});
        let linkInfo = getLinkInfo(url);
        if (linkInfo[0] === "PaintBoard" || linkInfo[0] === "Tokenizer") {
            socket.on("connect", () => {
                socket.emit("checkRoomID_Call", linkInfo[1]);
                socket.on("checkRoomID_Return", (isExist) => {
                    if (isExist) {
                        console.log("This room ID does exists!");
                        console.log("Connecting to the room...");
                        this.setState({paintBoardLink: "/PaintBoard/room=" + linkInfo[1]});
                        this.setState({tokenizerLink: "/Tokenizer/room=" + linkInfo[1]});
                        this.setState({room: linkInfo[1]});
                        this.setState({showPaint: true});
                    } else {
                        console.log("This room ID does not exist.");
                        console.log("Redirecting to the lobby...");
                        if (typeof window !== 'undefined') {
                            window.location.href = "http://localhost:3000/Lobby";
                       }
                    }
                });
            });
        }
    }

    startRoom() {
        if (this.state.artworkTitle != "") {
            this.setState({showPaint: true});
            this.setState({room: this.state.uuidv4});
        }
    };

    joinRoom() {
        if (this.state.room !== "") {
            this.setState({showPaint: true});
        }
    };

    setRoom(room) {
        if (this.state.artworkTitle == "") {
            this.setState({room: room});
            this.setState({paintBoardLink: "/PaintBoard/room=" + room});
        }
    }

    setArtworkTitle(artworkTitle) {
        this.setState({artworkTitle: artworkTitle});
    }

    render() {
        return (
            <Router>
                {!this.state.showPaint ? (
                    <div className="App">
                        <div className="lobby">
                            <header>Welcome to collaborative paint and tokenizer!</header>
                            <input
                                type="text"
                                placeholder="Artwork Title"
                                onChange={(event) => {
                                this.setArtworkTitle(event.target.value);
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Room ID"
                                onChange={(event) => {
                                this.setRoom(event.target.value);
                                }}
                            />
                            <button onClick={this.joinRoom}>
                                <Link to={this.state.paintBoardLink}>Join a Room</Link>
                            </button>
                            <button onClick={this.startRoom}>
                                <Link to={this.state.paintBoardLink}>Create a Room</Link>
                            </button>
                        </div>
                    </div>
                ) : (
                    <Switch>
                        <Route path={this.state.paintBoardLink}>
                            <PaintBoard room={this.state.room} artworkTitle={this.state.artworkTitle} />
                        </Route>
                        <Route path={this.state.tokenizerLink}>
                            <Tokenizer />
                        </Route>
                    </Switch>
                )}
            </Router>
        )
    }
}

export default New_Lobby;