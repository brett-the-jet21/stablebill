import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

let _prisma: PrismaClient | null = null;
let _initError: any = null;

function makeThrowProxy(err: any): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_t, prop) {
      // Allow harmless inspection during build without blowing up
      if (prop === Symbol.toStringTag) return "PrismaClient";
      if (prop === "then") return undefined; // avoid Promise-like checks
      throw err;
    },
  }) as PrismaClient;
}

export function getPrisma(): PrismaClient {
  if (_prisma) return _prisma;
  if (_initError) return makeThrowProxy(_initError);

  const g = global as any;
  if (g.__prisma) {
    _prisma = g.__prisma;
    return _prisma;
  }

  try {
    _prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") g.__prisma = _prisma;
    return _prisma;
  } catch (e) {
    // CRITICAL: do NOT throw during module import / next build collection
    _initError = e;
    return makeThrowProxy(e);
  }
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_t, prop) {
    const p = getPrisma() as any;
    return p[prop];
  },
}) as PrismaClient;

export default prisma;
