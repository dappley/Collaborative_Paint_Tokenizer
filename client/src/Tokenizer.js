import TokenGenerator from "./contracts/TokenGenerator.json";
import { base64ImageData } from "./components/canvas/Canvas";
import React, { useState, useEffect } from "react";
import { NFTStorage, File } from 'nft.storage';
import Connection from './helper/Connection';
import getWeb3 from "./helper/getWeb3";
import "./Tokenizer.css";
import Web3 from "web3";

const Tokenizer = () => {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [recipient, setRecipient] = useState(undefined);
  const [symbol, setSymbol] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [artwork, setArtwork] = useState(dataURLtoFile(base64ImageData, 'paint.png'));
  const [result, setResult] = useState(undefined);

  // Connects to MetaMask & gets account and contract info
  // Only when this js file is rendered first
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

  // Connects to MetaMask & gets account and contract info
  function connectMetaMask() {
    const connect = async() => {
      var web3;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Accounts now exposed
        } catch (error) {
          console.log(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        web3 = window.web3;
        console.log("Injected web3 detected.");
      }
      // Fallback to localhost; use dev console port by default...
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
      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance);
    }
    connect();
  }

  //Prints out the variable values
  function printAll() {
    console.log(recipient);
    console.log(symbol);
    console.log(name);
    console.log(description);
    console.log(artwork);
    console.log(web3);
    console.log(accounts);
    console.log(contract);
    console.log(result);
  }

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
      // require('dotenv').config()
      // const client = new NFTStorage({ token: process.env.REACT_APP_SECRET_APIKEY })
      const client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc5ODAzNDQ4ZTJhN0REQzlkZkEzMTVmNjRlY0UyMjVBMTk3NzJBQjQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMjUxNDY0MTQxNCwibmFtZSI6IkRpZ2l0YWxfQXJ0d29ya19NaW50ZXIifQ.iemBYngkmlnWA_GzU_qaDT9csnkndmYmKeYWlu0x-EI' })
      const metadata = await client.store({
        name: name,
        description: description,
        image: new File([artwork], artwork.name, { type: artwork.type })
      })
      // #TODO ERROR: Contract method doesn't have an address yet(?)
      const result = await contract.methods.createToken(recipient, description, symbol, metadata.url).send({ from: accounts[0] });
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
  function getResult() {
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
    } else {
      return (
        <div>
          <label>No Transaction Record</label>
        </div>
      )
    }
  }


  return (
    <div className="Tokenizer">
      {/* <Connection /> */}
      <button onClick={connectMetaMask}>Connect MetaMask</button>
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
      <button onClick={tokenize}>Tokenize</button>
      <button onClick={getResult}>Token Info</button>
    </div>
  );
}

export default Tokenizer;