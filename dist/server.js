"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const db_1 = require("./config/db");
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await (0, db_1.connectDB)(); // Check DB connection first
    const server = app_1.default.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    // Graceful shutdown
    process.on("SIGINT", async () => {
        await (0, db_1.disconnectDB)();
        server.close(() => process.exit(0));
    });
};
startServer();
