import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ invoices });
}

export async function POST(req: Request) {
  const body = await req.json();

  const customerName = String(body.customerName || "").trim();
  const customerEmail = body.customerEmail ? String(body.customerEmail).trim() : null;
  const memo = body.memo ? String(body.memo).trim() : null;

  const amount = Number(body.amount);
  if (!customerName) {
    return NextResponse.json({ error: "Customer name required" }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Amount must be > 0" }, { status: 400 });
  }

  const amountCents = Math.round(amount * 100);
  const token = crypto.randomUUID().replaceAll("-", "");

  const invoice = await prisma.invoice.create({
    data: {
      token,
      customerName,
      customerEmail,
      memo,
      amountCents,
      status: "SENT",
    },
  });

  return NextResponse.json({ invoice });
}
