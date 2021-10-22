import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PaintBoard from '../PaintBoard/container/Container';
import React from 'react';
import uuid from 'uuid';
import '../../App.css';
import getLinkInfo from '../../helper/getLinkInfo';
import Tokenizer from '../Tokenizer/Tokenizer';
import io from 'socket.io-client';

let socket;
const CONNECTION_PORT = 'http://localhost:5000';

class New_Lobby extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            room: "",
            artworkTitle: "",

            join: false,
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
        console.log(this.state.uuidv4);
        if (linkInfo[0] === "PaintBoard" || linkInfo[0] === "Tokenizer") {
            socket.on("connect", () => {
                socket.emit("checkRoomID_Call", linkInfo[1]);
                socket.on("checkRoomID_Return", (isExist) => {
                    console.log("isExist:", isExist);
                    if (isExist) {
                        console.log("This room ID does exists! :)");
                        console.log("Connecting to the room...");
                        this.setState({paintBoardLink: "/PaintBoard/room=" + linkInfo[1]});
                        this.setState({tokenizerLink: "/Tokenizer/room=" + linkInfo[1]});
                        this.setState({room: linkInfo[1]});
                        this.setState({showPaint: true});
                        this.setState({join: true});
                    } else {
                        console.log("This room ID does not exist. :(");
                        console.log("Redirecting to lobby...");
                    }
                });
            });
        }
        setInterval(() => console.log("Loading...."), 100000,);
    }

    startRoom() {
        if (/*username !== "" && */this.state.artworkTitle != "") {
            this.setState({showPaint: true});
        }
    };

    joinRoom() {
        if (/*username !== "" && */this.state.room !== "") {
            this.setState({showPaint: true});
            this.setState({join: true});
        }
    };

    setRoom(room) {
        this.setState({room: room});
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
                            {console.log("Join", this.state.join)}
                            {console.log(this.state.room)}
                            {console.log(this.state.uuidv4)}
                            {console.log(this.state.artworkTitle)}
                            <PaintBoard room={(this.state.join === true) ? this.state.room : this.state.uuidv4} /*username={username}*/ artworkTitle={this.state.artworkTitle} />
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