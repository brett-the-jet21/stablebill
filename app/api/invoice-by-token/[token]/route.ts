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

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { token: params.token } });
    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    return NextResponse.json(invoice);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
