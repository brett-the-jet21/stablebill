import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "../../../lib/stripe";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  const whsec = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !whsec) {
    return NextResponse.json({ error: "Missing webhook secret/signature" }, { status: 400 });
  }

  const body = await req.text();

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, whsec);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verify failed: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const invoiceId = session?.metadata?.invoiceId as string | undefined;

    if (invoiceId) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: "PAID", paidAt: new Date() },
      });
    }
  }

  return NextResponse.json({ received: true });
}
