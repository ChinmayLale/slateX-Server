"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.ApiError = void 0;
// src/middleware/globalErrorHandler.ts
const library_1 = require("@prisma/client/runtime/library");
class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", error = "Unexpected Error") {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.success = false;
        this.error = error;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            success: err.success,
            error: err.error,
            message: err.message,
        });
    }
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        let message = "Database error";
        let error = err.message;
        let statusCode = 400;
        switch (err.code) {
            case "P2002":
                message = `Unique constraint failed on the field: ${err.meta?.['target']}`;
                error = "Unique constraint violation";
                break;
            case "P2025":
                message = "Record not found";
                statusCode = 404;
                break;
        }
        return res.status(statusCode).json({
            status: statusCode,
            success: false,
            error,
            message,
        });
    }
    return res.status(500).json({
        status: 500,
        success: false,
        error: err.message || "Something went wrong",
        message: "Internal Server Error",
    });
};
exports.globalErrorHandler = globalErrorHandler;
