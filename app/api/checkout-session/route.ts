import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  // Guard: Stripe env not configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured (missing STRIPE_SECRET_KEY)" },
      { status: 503 }
    );
  }

  // Guard: DB not configured (prisma stub or not wired yet)
  if (!prisma || !(prisma as any).invoice) {
    return NextResponse.json(
      { error: "Database not configured (Prisma not initialized)" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const token = String(body.token || "").trim();
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const invoice = await (prisma as any).invoice.findUnique({ where: { token } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  if (invoice.status === "PAID") return NextResponse.json({ error: "Already paid" }, { status: 400 });

  const origin = req.headers.get("origin") || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: invoice.amountCents,
          product_data: {
            name: `Invoice ${invoice.id}`,
            description: invoice.memo || "Stable Bill invoice",
          },
        },
      },
    ],
    success_url: `${origin}/i/${invoice.token}?success=1`,
    cancel_url: `${origin}/i/${invoice.token}?canceled=1`,
    metadata: {
      invoiceId: String(invoice.id),
      invoiceToken: String(invoice.token),
    },
  });

  return NextResponse.json({ url: session.url });
}
