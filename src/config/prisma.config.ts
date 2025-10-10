import Prisma from "@/generated/prisma/client.js";
import type * as PrismaTypes from "@/generated/prisma/client.js";

// A variable to hold the single client instance
const prismaGlobal = global as typeof global & {
  prisma?: Prisma.PrismaClient;
};

// If the client doesn't exist (or is null), create it
// This logic ensures only one instance is ever created
export const prismaClient: Prisma.PrismaClient =
  prismaGlobal.prisma ||
  new Prisma.PrismaClient({
    // Optional: add logging configuration here
    log: ["query"],
  });

// In development, attach the client to the global object
// This prevents multiple instances during hot-reloading
if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prismaClient;
}

export type { PrismaTypes };
