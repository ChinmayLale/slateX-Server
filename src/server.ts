// src/server.ts
import { connectDB, disconnectDB } from "./config/db";

import app from "./app";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
   await connectDB(); // Check DB connection first

   const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
   });

   // Graceful shutdown
   process.on("SIGINT", async () => {
      await disconnectDB();
      server.close(() => process.exit(0));
   });
};

startServer();
