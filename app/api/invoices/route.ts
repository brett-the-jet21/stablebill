import { NextResponse } from "next/server";

type Invoice = {
  id: string;
  token: string;
  customerName: string;
  customerEmail?: string;
  amount: number;
  memo?: string;
  status: "unpaid" | "paid" | "void";
  createdAt: string;
};

function store(): Invoice[] {
  const g = globalThis as any;
  if (!g.__stablebill_invoices) g.__stablebill_invoices = [];
  return g.__stablebill_invoices as Invoice[];
}

function jsonOk(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function jsonErr(message: string, status = 500, extra?: any) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export async function GET() {
  try {
    const invoices = store().slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return jsonOk({ ok: true, invoices });
  } catch (err: any) {
    console.error("GET /api/invoices failed:", err);
    return jsonErr(err?.message || "Failed to load invoices");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const customerName = String(body?.customerName || "").trim();
    const customerEmail = String(body?.customerEmail || "").trim() || undefined;
    const memo = String(body?.memo || "").trim() || undefined;

    const amountNum = Number(body?.amount);
    const amount = Number.isFinite(amountNum) ? amountNum : NaN;

    if (!customerName) return jsonErr("Customer name is required", 400);
    if (!Number.isFinite(amount) || amount <= 0) return jsonErr("Amount must be > 0", 400);

    const id =
      (globalThis as any).crypto?.randomUUID?.() ||
      (await import("crypto")).randomUUID();

    const token =
      (globalThis as any).crypto?.randomUUID?.().replace(/-/g, "") ||
      (await import("crypto")).randomUUID().replace(/-/g, "");

    const invoice: Invoice = {
      id,
      token,
      customerName,
      customerEmail,
      amount,
      memo,
      status: "unpaid",
      createdAt: new Date().toISOString(),
    };

    store().push(invoice);

    const origin = req.headers.get("x-forwarded-host")
      ? `${req.headers.get("x-forwarded-proto") || "https"}://${req.headers.get("x-forwarded-host")}`
      : "https://stablebill.io";

    const link = `${origin}/i/${invoice.token}`;

    return jsonOk({ ok: true, invoice: { ...invoice, link } }, 201);
  } catch (err: any) {
    console.error("POST /api/invoices failed:", err);
    return jsonErr(err?.message || "Failed to create invoice");
  }
}
