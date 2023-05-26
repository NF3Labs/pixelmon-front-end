import { Config, ProviderConfig } from "../constants/apiBase";
import { SDK } from "nf3-sdk";
import { ethers } from 'ethers'

let backendSDK;

export const getBackendSDK = async () => {
  try {
    if (!backendSDK) {
      const config = { ...Config };
      config.contracts = [
        { name: "VAULT", address: "0x989B2939A5efeba37566112f07eEeD308555C1D8" },
        { name: "NF3Market", address: "0xDAace31834733322DEa2ffE0562e2b90075A4Af0" },
        { name: "ETH", address: "0x0000000000000000000000000000000000000000" }
      ];
      const url = ProviderConfig.providerURL + ProviderConfig.providerKey
      const provider = new ethers.providers.JsonRpcProvider(url)

      backendSDK = new SDK({ ...config, JsonRpcProvider: provider });
      await backendSDK.initializeBackend();
    }
    
    return backendSDK;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to initialize Backend SDK");
  }
};