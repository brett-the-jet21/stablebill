import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    const invoice = await prisma.invoice.findUnique({
      where: { token },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (err: any) {
    console.error("invoice-by-token GET failed:", err);
    return NextResponse.json(
      { error: "Server error", message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
