import React, { useState } from 'react';
import Tokenizer from '../../Tokenizer';
import Board from '../canvas/Canvas';
import './Container.css';

function Container({ room, username}) {
    const [color, setColor] = useState("#FFFFFF");
    const [size, setSize] = useState(10);
    const [eraser, setEraser] = useState(false);
    const [tokenize, setTokenize] = useState(false);

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
                    <header>Let's Paint!</header>
                    <p>User name: {username} / Room ID: {room}</p>
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
                    <div className="board-container">
                        {(room === null) ?
                            <h1>please enter your room id</h1> :
                            <Board
                                color={(eraser === false) ? color : "#FFFFFF"}
                                size={size}
                                room={room}
                            />
                        }
                    </div>
                    <div className="createImage">
                        <button onClick={tokenizer}>
                            Tokenize
                        </button>
                    </div>
                </div>
            ) : (
                <Tokenizer />
            )}
        </div>
    )
}

export default Container;

