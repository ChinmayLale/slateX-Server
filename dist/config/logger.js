"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.logger = void 0;
// src/config/logger.ts
const winston_1 = require("winston");
// Create a default logger
winston_1.loggers.add("default", {
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.colorize(), winston_1.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)),
    transports: [
        new winston_1.transports.Console(),
        // Optional: file transport
    ],
});
// Optional: create another logger for errors
winston_1.loggers.add("errorLogger", {
    level: "error",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
});
exports.logger = winston_1.loggers.get("default");
exports.errorLogger = winston_1.loggers.get("errorLogger");
