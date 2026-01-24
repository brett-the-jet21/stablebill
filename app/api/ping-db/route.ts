import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

const prisma = globalThis.__prismaClient ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prismaClient = prisma;

export async function GET() {
  try {
    const count = await prisma.invoice.count();
    return NextResponse.json({ ok: true, invoiceCount: count });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
