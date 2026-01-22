import { PrismaClient } from "@prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

function getSqlitePath() {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  // DATABASE_URL format: file:./dev.db
  return url.startsWith("file:") ? url.replace("file:", "") : url;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSQLite3(new Database(getSqlitePath())),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
