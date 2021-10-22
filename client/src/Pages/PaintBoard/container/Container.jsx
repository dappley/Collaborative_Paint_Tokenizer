import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState } from 'react';
import Tokenizer from '../../Tokenizer/Tokenizer';
import Canvas, {base64ImageData} from '../canvas/Canvas';
import './Container.css';

function Container({ room, /*username, */artworkTitle }) {
    const [tokenizerLink, setTokenizerLink] = useState("/Tokenizer/room=" + room);
    const [tokenize, setTokenize] = useState(false);
    const [color, setColor] = useState("#C83349");
    const [eraser, setEraser] = useState(false);
    const [size, setSize] = useState(5);

    function tokenizer() {
        if (base64ImageData != null) {
            setTokenize(true);
        }
    }

    const handleEraser = () => {
        setEraser(!eraser);
    }

    return (
        <Router>
            <div className="Container">
                {!tokenize? (
                    <div className="PaintBoard">
                        <header>Let's Paint!</header>
                        <p>Room ID: {room}</p>
                        {/* <p>User name: {username}</p> */}
                        <p>Brush size: {size}</p>
                        <div className="painting_tools">
                            <input
                                min={1}
                                max={30}
                                name=""
                                id="size"
                                type="range"
                                value={size} 
                                onChange={(event) => { setSize(event.target.value); }}
                            />
                            <input
                                id="color"
                                type="color"
                                value={color}
                                onChange={(event) => { setColor(event.target.value); }}
                            />
                            <button id="eraser" onClick={handleEraser}>
                                {(eraser === false) ? <div> Brush </div> : <div> Eraser </div>}
                            </button>
                        </div>
                        <div className="canvas">
                            {console.log("Canvas room ID:", room)}
                            <Canvas
                                color={(eraser === false) ? color : "#FFFFFF"}
                                artworkTitle={artworkTitle}
                                size={size}
                                room={room}
                            />
                        </div>
                        <div className="createImage">
                            <button onClick={tokenizer}>
                                <Link to={tokenizerLink}>Tokenize</Link>
                            </button>
                        </div>
                    </div>
                ) : (
                <Switch>
                    <Route path={tokenizerLink}>
                        {console.log(room)}
                        {console.log(artworkTitle)}
                      <Tokenizer room={room} artworkTitle={artworkTitle} />
                    </Route>
                </Switch>
                )}
            </div>
        </Router>
    )
}

export default Container;

