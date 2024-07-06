import React, { useState } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';

const chainId = "blockpostchain";
const rpcEndpoint = "http://localhost:1317";
const restEndpoint = "http://localhost:1317";

const App = () => {
  const [message, setMessage] = useState('');
  const [messageId, setMessageId] = useState('');
  const [retrievedMessage, setRetrievedMessage] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [txResult, setTxResult] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.keplr) {
        alert("Please install Keplr extension");
        return;
      }

      await window.keplr.enable(chainId);
      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();

      if (accounts.length === 0) {
        alert("No accounts found");
        return;
      }

      setWalletAddress(accounts[0].address);
    } catch (error) {
      console.error("Error connecting to Keplr wallet:", error);
      alert("Failed to connect to Keplr wallet. Please check the console for details.");
    }
  };

  const submitMessage = async () => {
    if (!message) {
      alert("Message cannot be empty");
      return;
    }

    try {
      const offlineSigner = window.getOfflineSigner(chainId);
      const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, offlineSigner);

      const result = await client.signAndBroadcast(
        walletAddress,
        [{
          typeUrl: "/blockpost.MsgCreateBlockPostMessage",
          value: {
            message: message
          }
        }],
        {
          amount: [{ denom: "stake", amount: "5000" }],
          gas: "200000"
        }
      );

      console.log(result);
      if (result.code === 0) {
        setTxResult("Message submitted successfully!");
      } else {
        setTxResult("Failed to submit message");
      }
    } catch (error) {
      console.error("Error submitting message:", error);
      alert("Failed to submit message. Please check the console for details.");
    }
  };

  const retrieveMessage = async () => {
    if (!messageId) {
      alert("Message ID cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${restEndpoint}/blockpost/blockpost/posts/${messageId}`);
      const data = await response.json();
      if (response.ok) {
        setRetrievedMessage(data.message);
      } else {
        setRetrievedMessage("Failed to retrieve message: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error retrieving message:", error);
      setRetrievedMessage("Failed to retrieve message. Please check the console for details.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>BlockPost</h1>
      <button onClick={connectWallet}>Connect Keplr Wallet</button>
      {walletAddress && <p>Wallet Address: {walletAddress}</p>}

      <div style={{ margin: '20px 0' }}>
        <h2>Submit a Message</h2>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button onClick={submitMessage}>Submit Message</button>
        {txResult && <p>{txResult}</p>}
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Retrieve a Message</h2>
        <input
          type="text"
          value={messageId}
          onChange={(e) => setMessageId(e.target.value)}
          placeholder="Enter message ID"
        />
        <button onClick={retrieveMessage}>Retrieve Message</button>
        {retrievedMessage && (
          <div>
            <h3>Retrieved Message</h3>
            <p>{retrievedMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
