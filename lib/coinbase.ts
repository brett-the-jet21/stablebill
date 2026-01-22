import Coinbase from "coinbase-commerce-node";

const C: any = Coinbase as any;
const Client = C?.Client || C?.client || C?.default?.Client || C?.default?.client;
const resources = C?.resources || C?.Resources || C?.default?.resources || C?.default?.Resources || {};

export const Charge = resources?.Charge;
export const Webhook = resources?.Webhook;

export function initCoinbase() {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) throw new Error("Missing COINBASE_COMMERCE_API_KEY");
  if (Client?.init) Client.init(apiKey);
  return { Client, resources };
}
