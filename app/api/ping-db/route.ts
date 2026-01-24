import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await prisma.invoice.count();
    return NextResponse.json({ ok: true, invoiceCount: count });
  } catch (err: any) {
    console.error("ping-db failed:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
