import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Charge } from "@/lib/coinbase";

export async function POST(req: Request) {
  const body = await req.json();
  const token = String(body.token || "").trim();
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const invoice = await prisma.invoice.findUnique({ where: { token } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  if (invoice.status === "PAID") return NextResponse.json({ error: "Already paid" }, { status: 400 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (req.headers.get("origin") || "http://localhost:3000");

  // Coinbase Commerce expects amount as string in major units (USD here)
  const amount = (invoice.amountCents / 100).toFixed(2);

  const charge = await Charge.create({
    name: `Stable Bill Invoice`,
    description: invoice.memo || `Invoice ${invoice.id}`,
    pricing_type: "fixed_price",
    local_price: { amount, currency: "USD" },
    metadata: { invoiceId: invoice.id, invoiceToken: invoice.token },
    redirect_url: `${appUrl}/i/${invoice.token}?crypto_success=1`,
    cancel_url: `${appUrl}/i/${invoice.token}?crypto_canceled=1`,
  });

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      paymentProvider: "COINBASE",
      cryptoChargeId: charge.id,
      cryptoHostedUrl: charge.hosted_url,
      paidCurrency: "USDC",
      status: "SENT",
    },
  });

  return NextResponse.json({ hostedUrl: charge.hosted_url, chargeId: charge.id });
}
