import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const token = String(body.token || "").trim();
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const invoice = await prisma.invoice.findUnique({ where: { token } });
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
      invoiceId: invoice.id,
      invoiceToken: invoice.token,
    },
  });

  return NextResponse.json({ url: session.url });
}
