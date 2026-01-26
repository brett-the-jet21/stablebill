import { NextResponse } from "next/server";
import { getPrisma } from "../../../lib/prisma";
import { getStripe } from "../../../lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Guard: Stripe env not configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured (missing STRIPE_SECRET_KEY)" },
      { status: 503 }
    );
  }

  // ✅ Lazy-init Prisma INSIDE handler (no build-time Prisma require)
  let prisma: any;
  try {
    prisma = await getPrisma();
  } catch (e: any) {
    return NextResponse.json(
      { error: "Database not configured (Prisma not initialized)" },
      { status: 503 }
    );
  }

  // Guard: DB model not present
  if (!prisma?.invoice) {
    return NextResponse.json(
      { error: "Database not configured (invoice model missing)" },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({} as any));
  const token = String((body as any).token || "").trim();
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const invoice = await prisma.invoice.findUnique({ where: { token } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  if (invoice.status === "PAID") return NextResponse.json({ error: "Already paid" }, { status: 400 });

  const origin = req.headers.get("origin") || "http://localhost:3000";
  const amountCents = Number(invoice.amountUsd ?? invoice.amountCents ?? 0);
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return NextResponse.json({ error: "Invoice amount invalid" }, { status: 400 });
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
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
