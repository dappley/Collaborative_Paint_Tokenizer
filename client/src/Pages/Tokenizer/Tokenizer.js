/* eslint-disable */
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PaintBoard from "../PaintBoard/container/Container.jsx";
import { base64ImageData } from "../PaintBoard/canvas/Canvas";
import { export_accounts, export_contract } from "../Lobby/Lobby";
import { NFTStorage, File } from 'nft.storage';
import React, { useState } from "react";
import "./Tokenizer.css";

import Frame from '../Img/Frame.png';

var tokenizer_toggle;

const Tokenizer = (props) => {
  const roomId = props.room;
  const artworkTitle = props.artworkTitle;
  const [recipient, setRecipient] = useState(undefined);
  const [symbol, setSymbol] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [artwork] = useState(dataURLtoFile(base64ImageData, 'paint.png'));
  const [result, setResult] = useState(undefined);
  const [back, setBack] = useState(false);
  const [paintBoardLink] = useState("/PaintBoard/room=" + roomId);
  const [loading, setLoading] = useState(false);

  //Converts the base64 image data to an image file
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  // Create IPFS & Metadata then pin the data on the nft.storage
  function tokenize() {
    const createToken = async () => {
      setLoading(true);
      require('dotenv').config()
      const client = new NFTStorage({ token: process.env.REACT_APP_SECRET_APIKEY })
      const metadata = await client.store({
        name: name,
        description: description,
        image: new File([artwork], artwork.name, { type: artwork.type })
      })
      const result = await export_contract.methods.createToken(recipient, description, symbol, metadata.url).send({ from: export_accounts[0] });
      const links = {
        artwork_link: `ipfs.io/ipfs/${metadata.data.image.pathname.slice(2)}`,
        metadata_link: `ipfs.io/ipfs/${metadata.ipnft}/metadata.json`,
        token_address: result.events.printAddress.returnValues.value,
        token_ID: result.events.printTokenID.returnValues.value
      }
      setResult(links);
      setLoading(false);
    };
    createToken();
  }

  // Returns the following values on the frontend:
  // artwork & metadatas' IPFS links, Token address and Token ID
  function ReturnTokenInfo() {
    if (result != null) {
      return (
        <div id="Tokenizer_Inputs">
          <div>
            <div id="Tokenizer_Inputs_Cell">
              <label>Artowkr Link:</label>
            </div>
            <div id="Tokenizer_Inputs_Cell">
              <label>Metadata Link:</label>
            </div>
            <div id="Tokenizer_Inputs_Cell">
              <label>Token address:</label>
            </div>
            <div id="Tokenizer_Inputs_Cell">
              <label>Token ID:</label>
            </div>
          </div>
          <div>
            <div id="Tokenizer_Inputs_Cell">
              <input readyonly type='text' value={result.artwork_link} />
            </div>
            <div id="Tokenizer_Inputs_Cell">
              <input readyonly type='text' value={result.metadata_link} />
            </div>
            <div id="Tokenizer_Inputs_Cell">
              <input readyonly type='text' value={result.token_address} />
            </div>
            <div id="Tokenizer_Inputs_Cell">
              <input readyonly type='text' value={result.token_ID} />
            </div>
          </div>
      </div>
      )
    } else {
      return (
        <div id="Tokenizer_EmptyMessage">
          <label>No Transaction Record</label>
        </div>
      )
    }
  }

  return (
    <Router>
      {loading && (
        <div id="LoadingScreen">
          <label>Tokenizing Your Artwork, Please Wait...</label>
        </div>
      )}
      <div className="Tokenizer">
        {!back? (
          <div className="Contents">
            <header>Digital Artwork Minter</header>
            <p>Convert your digital art work to a Non-fungible token!</p>
            <div id="ArtWork">
              <div id="ArtWork_Frame">
                <img src={Frame} />
              </div>
              <div id="ArtWork_Painting">
                <img src={base64ImageData} />
              </div>
            </div>
            <div id="Tokenizer_Inputs">
              <div>
                <div id="Tokenizer_Inputs_Cell">
                  <label>Recipient :</label>
                </div>
                <div id="Tokenizer_Inputs_Cell">
                  <label>Token Symbol :</label>
                </div>
                <div id="Tokenizer_Inputs_Cell">
                  <label>Token Name :</label>
                </div>
                <div id="Tokenizer_Inputs_Cell">
                  <label>Token Description :</label>
                </div>
              </div>
              <div>
                <div id="Tokenizer_Inputs_Cell">
                  <input type='text' onChange={(event) => {setRecipient(event.target.value); }} />
                </div>
                <div id="Tokenizer_Inputs_Cell">
                  <input type='text' onChange={(event) => {setSymbol(event.target.value); }} />
                </div>
                <div id="Tokenizer_Inputs_Cell">
                  <input type='text' onChange={(event) => {setName(event.target.value); }} />
                </div>
                <div id="Tokenizer_Inputs_Cell">
                  <input type='text' onChange={(event) => {setDescription(event.target.value); }} />
                </div>
              </div>
            </div>
            <div id="Tokenizer_Buttons">
              <button onClick={() => {
                setBack(true);
                tokenizer_toggle = !tokenizer_toggle;
              }}>
                <Link to={paintBoardLink} style={{ color: 'inherit', textDecoration: 'inherit'}}>Back</Link>
              </button>
              <button onClick={tokenize}>Tokenize</button>
            </div>
            <ReturnTokenInfo />
          </div>
        ) : (
          <Switch>
          <Route path={paintBoardLink}>
            <PaintBoard room={roomId} artworkTitle={artworkTitle}/>
          </Route>
        </Switch>
        )}
      </div>
    </Router>
  );
}

export {tokenizer_toggle};
export default Tokenizer;