"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_2 = require("@clerk/express");
const user_route_1 = __importDefault(require("./routes/user.route"));
const document_route_1 = __importDefault(require("./routes/document.route"));
const app = (0, express_1.default)();
// 1. Security middleware
app.use((0, helmet_1.default)());
const allowedOrigins = [
    "http://localhost:3000",
    "https://slate-x.vercel.app"
];
// 2. Enable CORS
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
// 3. Request logging in dev
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
// 4. Parse incoming JSON
app.use(express_1.default.json({ limit: '20kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
//MiddleWares
app.use((0, express_2.clerkMiddleware)());
// 5. Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" });
});
app.get('/ping', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Pong | Server is running",
        error: [],
        data: null
    });
});
app.use("/api/v1/user", user_route_1.default);
app.use("/api/v1/documents", document_route_1.default);
// 7. Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});
exports.default = app;
