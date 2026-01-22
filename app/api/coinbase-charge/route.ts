import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Charge, initCoinbase } from "../../../lib/coinbase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Guard: DB not configured (prisma stub or not wired yet)
  if (!prisma || !(prisma as any).invoice) {
    return NextResponse.json(
      { error: "Database not configured (Prisma not initialized)" },
      { status: 503 }
    );
  }

  // Guard: Coinbase not configured
  if (!process.env.COINBASE_COMMERCE_API_KEY) {
    return NextResponse.json(
      { error: "Coinbase Commerce not configured (missing COINBASE_COMMERCE_API_KEY)" },
      { status: 503 }
    );
  }

  // Ensure coinbase client initialized
  try {
    initCoinbase();
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Coinbase init failed" }, { status: 503 });
  }

  // Guard: Charge export missing (package export mismatch)
  if (!Charge || typeof (Charge as any).create !== "function") {
    return NextResponse.json(
      { error: "Coinbase Charge SDK unavailable (export mismatch)" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const token = String(body.token || "").trim();
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const invoice = await (prisma as any).invoice.findUnique({ where: { token } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  if (invoice.status === "PAID") return NextResponse.json({ error: "Already paid" }, { status: 400 });

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "http://localhost:3000";

  // Coinbase Commerce expects amount as string in major units (USD here)
  const amount = (invoice.amountCents / 100).toFixed(2);

  const charge = await (Charge as any).create({
    name: `Stable Bill Invoice`,
    description: invoice.memo || `Invoice ${invoice.id}`,
    pricing_type: "fixed_price",
    local_price: { amount, currency: "USD" },
    metadata: { invoiceId: invoice.id, invoiceToken: invoice.token },
    redirect_url: `${appUrl}/i/${invoice.token}?crypto_success=1`,
    cancel_url: `${appUrl}/i/${invoice.token}?crypto_canceled=1`
  });

  await (prisma as any).invoice.update({
    where: { id: invoice.id },
    data: {
      paymentProvider: "COINBASE",
      cryptoChargeId: charge.id,
      cryptoHostedUrl: charge.hosted_url,
      paidCurrency: "USDC",
      status: "SENT"
    }
  });

  return NextResponse.json({ hostedUrl: charge.hosted_url, chargeId: charge.id });
}
