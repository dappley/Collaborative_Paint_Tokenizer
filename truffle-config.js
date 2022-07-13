const path = require("path");

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "45235b9ed68b456f81374e2e74bdf94a";

const fs = require('fs');
const mnemonic = "often easily cram buffalo apple creek kiwi list aim pretty fade couple"; //fs.readFileSync(".secret").toString().trim();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_directory: './contracts/',
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    // ropsten: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}`),
    //   network_id: 3,
    //   gas: 5500000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // }
  },
  compilers: {
    solc: {
      version: "0.8.0",
      docker: false
    }
  }
};