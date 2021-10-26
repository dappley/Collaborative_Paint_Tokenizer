import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PaintBoard from '../PaintBoard/container/Container';
import getLinkInfo from '../../helper/getLinkInfo';
import io from 'socket.io-client';
import React from 'react';
import uuid from 'uuid';
import '../../App.css';

import Web3 from "web3";
import getWeb3 from "../../helper/getWeb3";
import TokenGenerator from "../../contracts/TokenGenerator.json";

let socket;
const CONNECTION_PORT = 'http://localhost:5000';

let export_accounts;
let export_contract;

class New_Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: "",
            artworkTitle: "",
            showPaint: false,
            uuidv4: uuid.v4(),
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
        let linkInfo = getLinkInfo(url);
        if (linkInfo[0] === "PaintBoard") {
            socket.on("connect", () => {
                socket.emit("checkRoomID_Call", linkInfo[1]);
                socket.on("checkRoomID_Return", (isExist, artworkTitle) => {
                    if (isExist) {
                        console.log("This room ID does exists!");
                        console.log("Connecting to the room...");
                        this.setState({paintBoardLink: "/PaintBoard/room=" + linkInfo[1]});
                        this.setState({room: linkInfo[1]});
                        this.setState({artworkTitle: artworkTitle});
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
        } else if (linkInfo[0] === "Lobby") {
            console.log("Welcome to collaborative painting & tokenizer!");
        } else {
            console.log("Error: Invalid Link, Redirecting to the lobby...");
            if (typeof window !== 'undefined') {
                window.location.href = "http://localhost:3000/Lobby";
            }
        }
    }

    componentDidMount = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = TokenGenerator.networks[networkId];
            const instance = new web3.eth.Contract(
                TokenGenerator.abi,
                deployedNetwork && deployedNetwork.address,
            );
            export_accounts = accounts;
            export_contract = instance;
            console.log(export_accounts);
            console.log(export_contract);
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
                );
            console.error(error);
        }
    };

    connectMetaMask = async() => {
        var web3;
        if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
        } catch (error) {
            console.log(error);
        }
        }
        else if (window.web3) {
        web3 = window.web3;
        console.log("Injected web3 detected.");
        }
        else {
        const provider = new Web3.providers.HttpProvider(
            "http://127.0.0.1:8545"
        );
        web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        }
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = TokenGenerator.networks[networkId];
        const instance = new web3.eth.Contract(
        TokenGenerator.abi,
        deployedNetwork && deployedNetwork.address,
        );
        export_accounts = accounts;
        export_contract = instance;
        console.log(export_accounts);
        console.log(export_contract);
      }

    startRoom() {
        if (this.state.artworkTitle !== "") {
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
        if (this.state.artworkTitle === "") {
            this.setState({room: room});
            this.setState({paintBoardLink: "/PaintBoard/room=" + room});
        }
    }

    setArtworkTitle(artworkTitle) {
        this.setState({artworkTitle: artworkTitle});
    }

    render() {
        return (
            <div>
                <button onClick={this.connectMetaMask}>Connect MetaMask</button>
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
                        </Switch>
                    )}
                </Router>
            </div>
        )
    }
}

export {export_accounts, export_contract};
export default New_Lobby;