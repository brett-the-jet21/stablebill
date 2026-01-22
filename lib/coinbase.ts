import Coinbase from "coinbase-commerce-node";

/**
 * coinbase-commerce-node exports are a bit "CommonJS-ish".
 * We'll grab Client/resources defensively.
 */
const C: any = Coinbase as any;
const Client = C?.Client || C?.client || C?.default?.Client || C?.default?.client;
const resources = C?.resources || C?.Resources || C?.default?.resources || C?.default?.Resources || {};

/**
 * Named exports used by your routes:
 *   import { Charge } from "@/lib/coinbase";
 *   import { Webhook } from "@/lib/coinbase";
 */
export const Charge = resources?.Charge;
export const Webhook = resources?.Webhook;

/**
 * Call this before using Charge/Webhook to ensure API key is loaded.
 * (We do this in the route handlers.)
 */
export function initCoinbase() {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) throw new Error("Missing COINBASE_COMMERCE_API_KEY");
  if (Client?.init) Client.init(apiKey);
  return { Client, resources };
}
