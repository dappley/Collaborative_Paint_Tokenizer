import React, { useState } from 'react';
import Tokenizer from '../../Tokenizer';
import Canvas from '../canvas/Canvas';
import './Container.css';

function Container({ room, username, artworkTitle }) {
    const [tokenize, setTokenize] = useState(false);
    const [color, setColor] = useState("#C83349");
    const [eraser, setEraser] = useState(false);
    const [size, setSize] = useState(5);

    function tokenizer() {
        setTokenize(true);
    }

    const handleEraser = () => {
        setEraser(!eraser);
    }

    return (
        <div className="Container">
            {!tokenize? (
                <div className="PaintBoard">
                    <header>Let's Paint {artworkTitle}!</header>
                    <p>Room ID: {room}</p>
                    <p>User name: {username}</p>
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
                    <Canvas
                        color={(eraser === false) ? color : "#FFFFFF"}
                        artworkTitle={artworkTitle}
                        size={size}
                        room={room}
                    />
                    <div className="createImage">
                        <button onClick={tokenizer}>Tokenize</button>
                    </div>
                </div>
            ) : (
                <Tokenizer />
            )}
        </div>
    )
}

export default Container;

