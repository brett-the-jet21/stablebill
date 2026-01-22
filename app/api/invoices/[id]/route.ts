import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const status = String(body.status || "").toUpperCase();

  const allowed = new Set(["SENT", "PAID"]);
  if (!allowed.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const invoice = await prisma.invoice.update({
    where: { id: params.id },
    data: {
      status,
      paidAt: status === "PAID" ? new Date() : null,
    },
  });

  return NextResponse.json({ invoice });
}
