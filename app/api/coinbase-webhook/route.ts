import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Webhook, initCoinbase } from "@/lib/coinbase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Guard: DB not configured
  if (!prisma || !(prisma as any).invoice) {
    return NextResponse.json(
      { error: "Database not configured (Prisma not initialized)" },
      { status: 503 }
    );
  }

  const sig = headers().get("x-cc-webhook-signature");
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature/secret" }, { status: 400 });
  }

  // Coinbase init (API key not strictly required for webhook verify in all setups,
  // but we keep it consistent and safe)
  try {
    if (process.env.COINBASE_COMMERCE_API_KEY) initCoinbase();
  } catch {
    // ignore init errors for webhook verify
  }

  if (!Webhook || typeof (Webhook as any).verifyEventBody !== "function") {
    return NextResponse.json(
      { error: "Coinbase Webhook SDK unavailable (export mismatch)" },
      { status: 503 }
    );
  }

  const rawBody = await req.text();

  let event: any;
  try {
    event = (Webhook as any).verifyEventBody(rawBody, sig, secret);
  } catch (e: any) {
    return NextResponse.json(
      { error: `Webhook verify failed: ${e?.message || "unknown error"}` },
      { status: 400 }
    );
  }

  const eventType = event?.type;
  const charge = event?.data;
  const chargeId = charge?.id;
  const invoiceId = charge?.metadata?.invoiceId;

  // Mark as paid on confirmed/resolved events
  if ((eventType === "charge:confirmed" || eventType === "charge:resolved") && invoiceId) {
    await (prisma as any).invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        paymentProvider: "COINBASE",
        cryptoChargeId: chargeId || undefined,
        paidCurrency: "USDC"
      }
    });
  }

  return NextResponse.json({ received: true });
}
