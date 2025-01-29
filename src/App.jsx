import React, { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const App = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [balance, setBalance] = useState("");
  const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function depositFunds() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Convert deposit amount to wei
        const tx = await contract.deposit(ethers.parseEther(depositAmount), { gasLimit: 300000 });
        await tx.wait();
        toast.success("Deposit successful!"); // Show success toast
      } catch (error) {
        toast.error("Deposit failed: " + error.message); // Show error toast
      }
    } else {
      toast.error("Ethereum wallet is not detected");
    }
  }

  async function withdrawFunds() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      try {
        // Validate withdrawal amount
        if (!withdrawAmount || isNaN(withdrawAmount)) {
          toast.error("Please enter a valid withdrawal amount");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Convert withdrawal amount to wei
        const tx = await contract.withdraw(ethers.parseEther(withdrawAmount), { gasLimit: 300000 });
        await tx.wait();
        toast.success("Withdrawal successful!"); // Show success toast
      } catch (error) {
        toast.error("Withdrawal failed: " + error.message); // Show error toast
      }
    } else {
      toast.error("Ethereum wallet is not detected");
    }
  }

  async function getContractBalance() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const balance = await contract.getBalance();
        setBalance(ethers.formatEther(balance));
        toast.success("Balance retrieved: " + ethers.formatEther(balance) + " ETH");
      } catch (error) {
        toast.error("Failed to retrieve balance: " + error.message);
      }
    } else {
      toast.error("Ethereum wallet is not detected");
    }
  }

  return (
    <div>
      <input
        type="text" // Corrected from typeof="text"
        placeholder="Enter deposit amount (ETH)"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
      />
      <input
        type="text" // Corrected from typeof="text"
        placeholder="Enter withdrawal amount (ETH)"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
      />
      <button onClick={depositFunds}>Deposit</button>
      <button onClick={withdrawFunds}>Withdraw</button>
      <button onClick={getContractBalance}>Show Balance</button>
      <p>
        <strong>Contract Balance:</strong>
        {balance} ETH
      </p>
      <ToastContainer /> {/* Container for the toasts */}
    </div>
  );
};

export default App;

// 0xd9145CCE52D386f254917e481eB44e9943F39138
