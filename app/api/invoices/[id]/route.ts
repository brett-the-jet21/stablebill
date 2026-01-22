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

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    const invoice = store().find((i) => i.id === id);
    if (!invoice) return jsonErr("Invoice not found", 404);
    return jsonOk({ ok: true, invoice });
  } catch (err: any) {
    console.error("GET /api/invoices/[id] failed:", err);
    return jsonErr(err?.message || "Failed to load invoice");
  }
}
