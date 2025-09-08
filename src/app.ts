// src/app.ts
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";




import userRoutes from './routes/user.route'
import documentRoutes from './routes/document.route'


const app: Application = express();

// 1. Security middleware
app.use(helmet());


const allowedOrigins = [
   "http://localhost:3000",
   "https://your-frontend-domain.com"
];

// 2. Enable CORS
app.use(cors({
   origin: allowedOrigins,
   credentials: true
}));
// 3. Request logging in dev
if (process.env.NODE_ENV !== "production") {
   app.use(morgan("dev"));
}

// 4. Parse incoming JSON
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//MiddleWares
app.use(clerkMiddleware())

// 5. Health check route
app.get("/health", (req: Request, res: Response) => {
   res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.get('/ping', (req, res) => {
   res.status(200).json({
      success: true,
      message: "Pong | Server is running",
      error: [],
      data: null
   });
})




app.use("/api/v1/user", userRoutes);

app.use("/api/v1/documents", documentRoutes);

// 7. Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
   console.error(err.stack);
   res.status(500).json({ error: "Something went wrong!" });
});

export default app;
