import Client from "coinbase-commerce-node";

export function initCoinbase() {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) throw new Error("Missing COINBASE_COMMERCE_API_KEY");
  Client.Client.init(apiKey);
  return Client;
}
