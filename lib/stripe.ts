import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // Keep this modern; Stripe will accept this format
  apiVersion: "2024-06-20"
});
