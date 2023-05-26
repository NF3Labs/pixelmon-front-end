import { useAppContext } from "../../../contexts/App";
import { getBackendSDK } from "../../../utils/getBackendSDK";

export default async function handler(req, res) {
  try {
    const { address } = req.query;
    const sdk = await getBackendSDK();

    const response = await sdk.api.accounts.p2pTraders(address)

    res.status(200).json({ data: response, status: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error" });
  }
}
