import React, { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [retrievedMessage, setRetrievedMessage] = useState("");
  const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
  async function setUserMessage() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.setMessage(userInput);
        const receipt = tx.wait();
         toast('Transaction successful !');
         console.log("  Transaction successful", receipt);
      } catch (error) {
        toast('ail  transaction!');
        console.log("fail  transaction", error);
      }
    }
  }
  async function getUserMessage() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
     
    
      const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const tx = await contract.getMessage();
        setRetrievedMessage(tx)
        toast('Transaction successful !');
        console.log("  Transaction successful", receipt);
     } catch (error) {
       toast('ail  transaction!');
       console.log("fail  transaction", error);
     }
   }
 }

  return (
    <div>
      <input typeof="text" placeholder="set your message" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
      <button onClick={setUserMessage}>Deposit</button>
      <button onClick={getUserMessage} >Withdraw</button>
      <p ><strong>Retrieved Message:</strong>  {retrievedMessage}</p>
    </div>
  );
};

export default App;

// 0xd9145CCE52D386f254917e481eB44e9943F39138