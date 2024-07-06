import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const chainId = "blockpostchain";

const chainInfo = {
  chainId: chainId,
  chainName: "BlockPost Chain",
  rpc: "http://localhost:1317",
  rest: "http://localhost:1317",
  stakeCurrency: {
    coinDenom: "STAKE",
    coinMinimalDenom: "stake",
    coinDecimals: 6,
  },
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "cosmos",
    bech32PrefixAccPub: "cosmospub",
    bech32PrefixValAddr: "cosmosvaloper",
    bech32PrefixValPub: "cosmosvaloperpub",
    bech32PrefixConsAddr: "cosmosvalcons",
    bech32PrefixConsPub: "cosmosvalconspub",
  },
  currencies: [{
    coinDenom: "STAKE",
    coinMinimalDenom: "stake",
    coinDecimals: 6,
  }],
  feeCurrencies: [{
    coinDenom: "STAKE",
    coinMinimalDenom: "stake",
    coinDecimals: 6,
  }],
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
};

window.onload = async () => {
  if (!window.keplr) {
    alert("Please install Keplr extension");
  } else {
    await window.keplr.experimentalSuggestChain(chainInfo);
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
