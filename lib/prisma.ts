import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined | null;
}

const cached = globalThis.__prisma ?? undefined;

export const prisma =
  cached ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export async function getPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
  }
  return prisma;
}
