/* eslint-disable */
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PaintBoard from "../PaintBoard/container/Container.jsx";
import { base64ImageData } from "../PaintBoard/canvas/Canvas";
import { export_accounts, export_contract } from "../Lobby/Lobby";
import { NFTStorage, File } from 'nft.storage';
import React, { useState } from "react";
import "./Tokenizer.css";

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
    };
    createToken();
  }

  // Returns the following values on the frontend:
  // artwork & metadatas' IPFS links, Token address and Token ID
  function ReturnTokenInfo() {
    if (result != null) {
      return (
        <div id='renderResult'>
          <label>Artowkr Link:</label>
          <input type='text' value={result.artwork_link} />
          <label>Metadata Link:</label>
          <input type='text' value={result.metadata_link} />
          <label>Token address:</label>
          <input type='text' value={result.token_address} />
          <label>Token ID:</label>
          <input type='text' value={result.token_ID} />
        </div>
      )
    } else {
      return (
        <div>
          <label>No Transaction Record</label>
        </div>
      )
    }
  }

  return (
    <Router>
      <div className="Tokenizer">
        {!back? (
          <div className="Contents">
            <button onClick={() => {
              setBack(true);
              tokenizer_toggle = !tokenizer_toggle;
              }}>
              <Link to={paintBoardLink} style={{ color: 'inherit', textDecoration: 'inherit'}}>Back</Link>
            </button>
            <header>Digital Artwork Minter</header>
            <p>Convert your digital art work to a Non-fungible token!</p>
            <img src={base64ImageData} />
            <div>
              <label>Recipient :</label>
              <input type='text' onChange={(event) => {setRecipient(event.target.value); }} />
            </div>
            <div>
              <label>Token Symbol :</label>
              <input type='text' onChange={(event) => {setSymbol(event.target.value); }} />
            </div>
            <div>
              <label>Token Name :</label>
              <input type='text' onChange={(event) => {setName(event.target.value); }} />
            </div>
            <div>
              <label>Token Description :</label>
              <input type='text' onChange={(event) => {setDescription(event.target.value); }} />
            </div>
            <button onClick={tokenize}>Tokenize</button>
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