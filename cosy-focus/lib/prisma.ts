// Reusable Prisma client for API routes

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Singleton pattern to ensure a single PrismaClient instance

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set. Check your .env file.");
}

export const prisma =
    global.prisma ?? new PrismaClient({
        adapter: new PrismaMariaDb(databaseUrl),
    });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}