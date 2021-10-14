import React, { useState, useEffect } from "react";
import { NFTStorage, File } from 'nft.storage';
import TokenGenerator from "./contracts/TokenGenerator.json";
import getWeb3 from "./getWeb3";
import { base64ImageData } from "./components/canvas/Canvas"
import "./Tokenizer.css";
import Web3 from "web3";
import Connection from './Connection';

const Tokenizer = () => {
  //     web3: null,
  //     results: null,
  //     artwork: null,
  //     accounts: null,
  //     contract: null,
  //     tokenSymbol: '',
  //     tokenName: '',
  //     recipient: '',
  //     tokenDescription: '',
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [recipient, setRecipient] = useState(undefined);
  const [symbol, setSymbol] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [artwork, setArtwork] = useState(dataURLtoFile(base64ImageData, 'paint.png'));
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    const init = async() => {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TokenGenerator.networks[networkId];
      const instance = new web3.eth.Contract(
        TokenGenerator.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state
      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance);
    }
    init();
  },[])

  function printAll() {
    console.log(recipient);
    console.log(symbol);
    console.log(name);
    console.log(description);
    console.log(artwork);
    console.log(artwork.name);
    console.log(artwork.type);
  }

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
  function onSubmit() {
    const tokenize = async () => {
      require('dotenv').config()
      // const client = new NFTStorage({ token: process.env.REACT_APP_SECRET_APIKEY })
      const client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc5ODAzNDQ4ZTJhN0REQzlkZkEzMTVmNjRlY0UyMjVBMTk3NzJBQjQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMjUxNDY0MTQxNCwibmFtZSI6IkRpZ2l0YWxfQXJ0d29ya19NaW50ZXIifQ.iemBYngkmlnWA_GzU_qaDT9csnkndmYmKeYWlu0x-EI' })
      const metadata = await client.store({
        name: name,
        description: description,
        image: new File([artwork], artwork.name, { type: artwork.type })
      })
      // create Token
      const result = await contract.methods.createToken(recipient, description, symbol, metadata.url).send({ from: accounts[0] });
      const links = {
        artwork_link: `ipfs.io/ipfs/${metadata.data.image.pathname.slice(2)}`,
        metadata_link: `ipfs.io/ipfs/${metadata.ipnft}/metadata.json`,
        token_address: result.events.printAddress.returnValues.value,
        token_ID: result.events.printTokenID.returnValues.value
      }
      setResult(links);
    };
    tokenize();
  }

  function getResut() {
    if (result != null) {
      return (
        <div>
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
    }
  }

  return (
    <div className="Tokenizer">
      <Connection />
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
      <button onClick={printAll}>PrintAll</button>
      <button onClick={onSubmit}>Tokenize</button>
      {/* <form onSubmit={this.onSubmit} >
        <input type='submit' value='Tokenize' />
      </form> */}
      {/* <form>
        {returnResults()}
      </form> */}
    </div>
  );
}

export default Tokenizer;