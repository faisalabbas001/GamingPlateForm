import { ethers } from "ethers";
import { parseUnits } from "viem";
import {  writeContract } from "@wagmi/core";
import { config } from "@/app/config";
import { abis } from "./abi";
import { Bounce, toast } from "react-toastify";

const RPC = "https://sepolia.drpc.org";
const USDC_CONTRACT_ADDRESS = process.env.USDC_CONTRACT_ADDRESS;
const recipientWallet = process.env.RECEIVER_ADDRESS;

// Function to wait for the transaction to complete
export const waitForTransactionToComplete = async (
  hash: string
): Promise<number> => {
  const provider = new ethers.JsonRpcProvider(RPC);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const trx = await provider.getTransaction(hash);
      if (trx && trx.blockNumber) {
        return trx.blockNumber; // Transaction completed successfully
      } else {
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds before retry
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  }
};

// Main function to handle crypto payment logic
export const handleCryptoPayment = async (
  amount: string,
  address: `0x${string}`
): Promise<boolean> => {
  try {
    console.log("address 1212",address)
    // const balance = await getBalance(config, {
    //   address,
    //   token: USDC_CONTRACT_ADDRESS as `0x${string}`,
    // });
    const balance = 10;
    // console.log("balance", balance.formatted.toString());
    console.log("amount", amount);
    // console.log(
    //   "balance.formatted<amount",
    //   Number(balance.formatted) < Number(amount)
    // );
    if (Number(balance) < Number(amount)) {
      console.log("here");
      toast.error("Insufficient Balance !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        style: {
          background: "#4c1d95",
          color: "white",
        },
      });
      return false;
    }

    // Convert amount to proper decimal format
    const parsedAmount = parseUnits(amount, 6); // USDC has 6 decimals

    console.log("Sending transaction with amount:", parsedAmount.toString());

    // Call the contract to transfer USDC
    const txHash = await writeContract(config, {
      address: USDC_CONTRACT_ADDRESS as `0x${string}`,
      abi: abis,
      functionName: "transfer", 
      args: [recipientWallet, parsedAmount],
    });

    console.log("Transaction hash:", txHash);

    // Wait for the transaction to complete
    const success = await waitForTransactionToComplete(txHash);

    console.log("Transaction successful. Block number:", success);
    return true;
  } catch (error) {
    toast.error("Error while processing the transaction!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      style: {
        background: "#4c1d95",
        color: "white",
      },
    });

    console.error("Error while processing the transaction:", error);
    return false;
  }
};
