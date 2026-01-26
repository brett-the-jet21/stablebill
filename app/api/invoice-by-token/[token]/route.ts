import { NextResponse } from "next/server";
import { getPrisma } from "../../../../lib/prisma";
import { publicInvoice } from "../../../../lib/invoices";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  try {
    const prisma = await getPrisma();
    const invoice = await prisma.invoice.findUnique({
      where: { token: params.token },
      include: { client: true },
    });
    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    return NextResponse.json({ invoice: publicInvoice(invoice) });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", message: err?.message ?? String(err) },
      { status: err?.message?.includes("DATABASE_URL") ? 503 : 500 }
    );
  }
}
