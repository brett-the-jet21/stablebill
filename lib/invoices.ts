import type { Prisma } from "@prisma/client";

export type InvoiceWithClient = Prisma.InvoiceGetPayload<{ include: { client: true } }>;

const PLACEHOLDER_DOMAIN = "stablebill.local";

export function normalizeAmountToCents(amount: string | number): number {
  const raw = typeof amount === "number" ? String(amount) : amount;
  const normalized = String(raw || "").replace(/[, ]+/g, "");
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) return Number.NaN;
  return Math.round(parsed * 100);
}

export function publicInvoice(invoice: InvoiceWithClient) {
  const amountCents = Number(invoice.amountUsd || 0);
  const amountMajor = amountCents / 100;
  const email = invoice.client?.email ?? null;
  const isPlaceholder =
    !!email && email.endsWith(`@${PLACEHOLDER_DOMAIN}`) && email.startsWith("unknown+");

  return {
    id: invoice.id,
    token: invoice.token,
    status: invoice.status,
    memo: invoice.memo ?? null,
    customerName: invoice.client?.name ?? "Customer",
    customerEmail: isPlaceholder ? null : email,
    currency: invoice.stablecoin,
    chain: invoice.chain,
    amountCents,
    amountUsd: amountMajor,
    amount: amountMajor,
    createdAt: invoice.createdAt.toISOString(),
    paidAt: invoice.paidAt ? invoice.paidAt.toISOString() : null,
  };
}

export function ownerIdentity() {
  return {
    email: process.env.STABLEBILL_OWNER_EMAIL || "owner@stablebill.local",
    company: process.env.STABLEBILL_OWNER_COMPANY || null,
    payTo: process.env.STABLEBILL_PAY_TO || "StableBill",
  };
}

export function clientEmailFrom(customerEmail: string | null, token: string) {
  const email = customerEmail?.trim();
  return email && email.length > 0 ? email : `unknown+${token}@${PLACEHOLDER_DOMAIN}`;
}
