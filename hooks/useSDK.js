import { useEffect, useState } from "react";
import { Config } from "../constants/apiBase";
import { useProvider } from "wagmi";
import { SDK } from "nf3-sdk";
import axios from "axios";

export const useSDK = () => {
  const [data, setData] = useState();
  const provider = useProvider();

  const getSDK = async () => {
    try {
      if (data === undefined) {
        const config = { ...Config, JsonRpcProvider: provider };
        config.contracts = [{ "name": "VAULT", "address": "0x989B2939A5efeba37566112f07eEeD308555C1D8" }, { "name": "NF3Market", "address": "0xDAace31834733322DEa2ffE0562e2b90075A4Af0" }, { "name": "ETH", "address": "0x0000000000000000000000000000000000000000" }];
        
        const frontendSDK = new SDK(config);
        const response = await axios.get('/api/get/getFts')
        const fts = response.data.data
        await frontendSDK.intializeFrontend(fts);

        setData(frontendSDK);

        return frontendSDK;
      } else {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSDK();
  }, [provider]);

  return {
    getSDK,
    data,
  };
};
