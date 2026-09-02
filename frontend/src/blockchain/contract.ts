import { BrowserProvider, Contract } from "ethers";
import PharmaChain from "./PharmaChain.json";

export const CONTRACT_ADDRESS =
  "0x481245780E5757b89e52D4ebDa567eFE91F31110";

export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new BrowserProvider(window.ethereum);

  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();

  return new Contract(
    CONTRACT_ADDRESS,
    PharmaChain.abi,
    signer
  );
}