import Coinbase from "coinbase-commerce-node";

const apiKey = process.env.COINBASE_COMMERCE_API_KEY || "";
Coinbase.Client.init(apiKey);

export const Charge = Coinbase.resources.Charge;
export const Webhook = Coinbase.Webhook;
