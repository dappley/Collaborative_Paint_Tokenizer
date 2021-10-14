import {useWallet, UseWalletProvider} from 'use-wallet';
import React from 'react';

function Connection() {
  const wallet = useWallet();

  const connectWallet = async (e) => {
    e.preventDefault()
    await wallet.connect()
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  )
}

export default () => (
    <UseWalletProvider
        chainId={1337}
        connectors={{
            provided: {provider: window.cleanEthereum},
        }}
    >
        <Connection />
    </UseWalletProvider>
)