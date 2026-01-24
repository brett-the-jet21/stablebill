import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Prisma must run on Node, not Edge:
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { token }
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (err: any) {
    console.error("invoice-by-token GET failed", {
      message: err?.message,
      stack: err?.stack
    });
    return NextResponse.json(
      { error: "Server error", message: err?.message ?? "unknown" },
      { status: 500 }
    );
  }
}
