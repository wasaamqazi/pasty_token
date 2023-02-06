import logo from "./logo.svg";
import "./App.css";
import { waitForConfirmation } from "algosdk";
import { useEffect, useState } from "react";

import MyAlgoConnect from "@randlabs/myalgo-connect";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const algosdk = require("algosdk");
const baseServer = "https://mainnet-algorand.api.purestake.io/ps2";
const port = "";
const token = {
  "X-API-Key": "wdZEB4CRKS83eNAKYpTGZ9EJE7I2Yz032jOKdD4g",
};
const algodClient = new algosdk.Algodv2(token, baseServer, port);

// const WalletAddress = algosdk.mnemonicToSecretKey(
//   "cloth intact extend pull sad miss popular mansion lobster napkin space oyster correct warm miss neither confirm snow virtual evoke era lock amused abandon first"
// );
// console.log(WalletAddress); // HCNMMIL3MKYILOLUO74NF6OPCJU4RU7IE5PX6JYBIT5YHAMQIVO5YADHMU
const myAlgoWallet = new MyAlgoConnect();

function App() {
  const [WalletAddress, setWalletAddress] = useState("");
  // const [userAccount, setuserAccount] = useState("");
  async function connectAlgoWallet() {
    try {
      const accounts = await myAlgoWallet.connect();
      setWalletAddress(accounts[0].address);
    } catch (err) {
      console.error(err);
    }
  }

  const firstAsset = async () => {
    try {
      let params = await algodClient.getTransactionParams().do();
      console.log(params);

      let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
        WalletAddress, // from address
        algosdk.encodeObj("first asset"), // note
        100000000000, // total supply
        2, // decimals
        false, // default frozen: we want to transact the asset
        WalletAddress, // manager account
        WalletAddress, // reserve account
        WalletAddress, // freeze account
        WalletAddress, // clawback account
        "PSTY", // unit name
        "Pasty Token", // asset name
        "https://a-usd.com", // asset URL,
        undefined, // assetMetadatahash
        params
      );

      // rawSignedTxn = await myAlgoWallet.signTransaction(txn.toByte());
      // console.log(rawSignedTxn);
      // const txss = await algodClient.sendRawTransaction(rawSignedTxn.blob).do();
      // console.log(tx);
      // console.log("Trasaction id: ", tx.txId);
      // const ptx = await algosdk.waitForConfirmation(algodClient, tx.txId, 4).then(res => {
      //     setTimeout(() => {
      //         bodyelem.style.overflow = "auto"
      //         navigate("/mynfts")
      //     }, 3000);
      // });
      // // // Get the new asset's information from the creator account
      // assetID = ptx["asset-index"];
      // console.log(assetID);
      // console.log(typeof (assetID));

      let rawSignedTxn = await myAlgoWallet.signTransaction(txn.toByte());
      let tx = await algodClient.sendRawTransaction(rawSignedTxn.blob).do();
      console.log("Asset Creation Txn : " + tx.txId);
      let confirmedTxn = await waitForConfirmation(algodClient, tx.txId, 4);
      //Get the completed Transaction
      console.log(
        "Transaction confirmed in round " + confirmedTxn["confirmed-round"]
      );
      let accountInfo = await algodClient
        .accountInformation(WalletAddress)
        .do();
      console.log(accountInfo);
    } catch (error) {
      console.log("err", error);
    }
  };

  useEffect(() => {
    console.log(WalletAddress);
  }, [WalletAddress]);

  return (
    <div className="App">
      <div className="header">
        <img className="logo" src="../assets/images/logo.png" />
      </div>
      {WalletAddress || WalletAddress !== "" ? (
        <button>{WalletAddress}</button>
      ) : (
        <button onClick={connectAlgoWallet}>Connect Wallet</button>
      )}

      <button onClick={firstAsset}>Create FTToken</button>
    </div>
  );
}

export default App;
