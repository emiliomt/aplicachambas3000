import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

  let url: string;
  if (databaseUrl.startsWith("libsql://") || databaseUrl.startsWith("https://")) {
    // Turso hosted database
    url = databaseUrl;
  } else {
    // Local SQLite file — make path absolute
    const filePart = databaseUrl.startsWith("file:") ? databaseUrl.slice(5) : databaseUrl;
    const absolutePath = path.isAbsolute(filePart)
      ? filePart
      : path.join(process.cwd(), filePart);
    url = `file:${absolutePath}`;
  }

  const adapter = new PrismaLibSql({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
