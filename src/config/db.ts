// src/config/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
   var prisma: PrismaClient | undefined;
}

export const prisma =
   global.prisma ||
   new PrismaClient({
      log: [ "error", "warn"], // Optional: Log queries/errors
   });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Check database connection
export const connectDB = async () => {
   try {
      await prisma.$connect();
      console.log("✅ Database connected successfully");
   } catch (error) {
      console.error("❌ Database connection failed:", error);
      process.exit(1); // Exit if DB not connected
   }
};

export const disconnectDB = async () => {
   await prisma.$disconnect();
   console.log("🔌 Database disconnected");
};
