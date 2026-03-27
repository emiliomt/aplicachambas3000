import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  // rawUrl is like "file:./dev.db" — make the path absolute so it works from any CWD
  const filePart = rawUrl.startsWith("file:") ? rawUrl.slice(5) : rawUrl;
  const absolutePath = path.isAbsolute(filePart)
    ? filePart
    : path.join(process.cwd(), filePart);

  const adapter = new PrismaLibSql({ url: `file:${absolutePath}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
