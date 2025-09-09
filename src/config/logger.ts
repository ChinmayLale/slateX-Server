// src/config/logger.ts
import { loggers, format, transports } from "winston";

// Create a default logger
loggers.add("default", {
   level: "info",
   format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.colorize(),
      format.printf(
         ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
      )
   ),
   transports: [
      new transports.Console(),
      // Optional: file transport
   ],
});

// Optional: create another logger for errors
loggers.add("errorLogger", {
   level: "error",
   format: format.combine(
      format.timestamp(),
      format.json()
   ),
});

export const logger = loggers.get("default");
export const errorLogger = loggers.get("errorLogger");
