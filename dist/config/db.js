"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = exports.prisma = void 0;
// src/config/prisma.ts
const client_1 = require("@prisma/client");
exports.prisma = global.prisma ||
    new client_1.PrismaClient({
        log: ["error", "warn"], // Optional: Log queries/errors
    });
if (process.env.NODE_ENV !== "production")
    global.prisma = exports.prisma;
// Check database connection
const connectDB = async () => {
    try {
        await exports.prisma.$connect();
        console.log("✅ Database connected successfully");
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit if DB not connected
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    await exports.prisma.$disconnect();
    console.log("🔌 Database disconnected");
};
exports.disconnectDB = disconnectDB;
