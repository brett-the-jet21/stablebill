import { NextResponse } from "next/server";
import { getPrisma } from "../../../lib/prisma";
import { clientEmailFrom, normalizeAmountToCents, ownerIdentity, publicInvoice } from "../../../lib/invoices";

function jsonOk(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function jsonErr(message: string, status = 500, extra?: any) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export async function GET() {
  try {
    const prisma = await getPrisma();
    const invoices = await prisma.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ ok: true, invoices: invoices.map(publicInvoice) });
  } catch (err: any) {
    console.error("GET /api/invoices failed:", err);
    return jsonErr(err?.message || "Failed to load invoices", err?.message?.includes("DATABASE_URL") ? 503 : 500);
  }
}

export async function POST(req: Request) {
  try {
    const prisma = await getPrisma();
    const body = await req.json();

    const customerName = String(body?.customerName || "").trim();
    const customerEmail = String(body?.customerEmail || "").trim() || undefined;
    const memo = String(body?.memo || "").trim() || undefined;

    const amountNum = normalizeAmountToCents(body?.amount ?? body?.amountUsd ?? body?.amountCents ?? body?.amount_cents);
    const amount = Number.isFinite(amountNum) ? amountNum : NaN;
    const currency = String(body?.currency || "USDC").trim().toUpperCase();
    const chain = String(body?.chain || "Base").trim();

    if (!customerName) return jsonErr("Customer name is required", 400);
    if (!Number.isFinite(amount) || amount <= 0) return jsonErr("Amount must be > 0", 400);

    const token =
      (globalThis as any).crypto?.randomUUID?.().replace(/-/g, "") ||
      (await import("crypto")).randomUUID().replace(/-/g, "");

    const owner = ownerIdentity();
    const user = await prisma.user.upsert({
      where: { email: owner.email },
      update: owner.company ? { company: owner.company } : {},
      create: { email: owner.email, company: owner.company },
    });

    const clientEmail = clientEmailFrom(customerEmail ?? null, token);
    const client = await prisma.client.upsert({
      where: { email: clientEmail },
      update: customerName ? { name: customerName } : {},
      create: { email: clientEmail, name: customerName || null },
    });

    const invoice = await prisma.invoice.create({
      data: {
        token,
        status: "SENT",
        amountUsd: amount,
        stablecoin: currency || "USDC",
        chain: chain || "Base",
        memo,
        payTo: owner.payTo,
        userId: user.id,
        clientId: client.id,
      },
      include: { client: true },
    });

    const origin = req.headers.get("x-forwarded-host")
      ? `${req.headers.get("x-forwarded-proto") || "https"}://${req.headers.get("x-forwarded-host")}`
      : req.headers.get("origin") || "https://stablebill.io";

    const link = `${origin}/i/${invoice.token}`;

    return jsonOk({ ok: true, invoice: { ...publicInvoice(invoice), link } }, 201);
  } catch (err: any) {
    console.error("POST /api/invoices failed:", err);
    return jsonErr(err?.message || "Failed to create invoice", err?.message?.includes("DATABASE_URL") ? 503 : 500);
  }
}
