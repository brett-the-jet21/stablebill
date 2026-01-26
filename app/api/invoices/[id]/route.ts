import { NextResponse } from "next/server";
import { getPrisma } from "../../../../lib/prisma";
import { publicInvoice } from "../../../../lib/invoices";

function jsonOk(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function jsonErr(message: string, status = 500, extra?: any) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const prisma = await getPrisma();
    const id = ctx.params.id;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { client: true },
    });
    if (!invoice) return jsonErr("Invoice not found", 404);
    return jsonOk({ ok: true, invoice: publicInvoice(invoice) });
  } catch (err: any) {
    console.error("GET /api/invoices/[id] failed:", err);
    return jsonErr(err?.message || "Failed to load invoice", err?.message?.includes("DATABASE_URL") ? 503 : 500);
  }
}
