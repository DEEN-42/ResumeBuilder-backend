import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
dotenv.config();
import { connectToDatabase } from "./db.js";
import { socketAuth } from "./middleware/socketAuth.js";
import { handleSocketConnection } from "./socket/socketHandlers.js";
import userRoute from "./Routes/userRoute.js";
import resumeRoute from "./Routes/resumeRoutes.js";
import aiRoutes from "./Routes/aiRoutes.js";

const PORT = process.env.PORT || 3030;

const startServer = async () => {
  const app = express();
  const server = createServer(app);

  const allowedOrigins = ["https://resumebuilder-frontend-i6nn.vercel.app"];

  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  // Connect to Redis before starting the server
  await Promise.all([pubClient.connect(), subClient.connect()]);

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT"],
      credentials: true,
    },
    // <-- 4. Tell Socket.IO to use the Redis adapter
    adapter: createAdapter(pubClient, subClient, {
      requestsTimeout: 5000, // time in ms (10 seconds)
    }),
  });

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  await connectToDatabase();

  app.use(express.json());
  app.use("/users", userRoute);
  app.use("/resumes", resumeRoute);
  app.use("/ai", aiRoutes);

  // Socket.io middleware for authentication
  io.use(socketAuth);

  // Handle socket connections
  io.on("connection", (socket) => {
    handleSocketConnection(io, socket, pubClient);
  });

  // Make io available globally for use in other files
  app.set("io", io);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("✅ Redis adapter connected for Socket.IO scaling.");
  });
};

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
});
