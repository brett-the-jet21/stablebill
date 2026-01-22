import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Webhook } from "@/lib/coinbase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = headers().get("x-cc-webhook-signature");
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature/secret" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: any;
  try {
    event = Webhook.verifyEventBody(rawBody, sig, secret);
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook verify failed: ${e.message}` }, { status: 400 });
  }

  // When a charge is confirmed/paid, status is usually "CONFIRMED" (and later "COMPLETED")
  const eventType = event?.type;
  const charge = event?.data;
  const chargeId = charge?.id;
  const invoiceId = charge?.metadata?.invoiceId;

  // Mark as paid on confirmed/completed events
  if ((eventType === "charge:confirmed" || eventType === "charge:resolved" || eventType === "charge:failed") && invoiceId) {
    if (eventType === "charge:confirmed" || eventType === "charge:resolved") {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: "PAID",
          paidAt: new Date(),
          paymentProvider: "COINBASE",
          cryptoChargeId: chargeId || undefined,
          paidCurrency: "USDC",
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
