import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import logger from './src/utils/logger.js';
import httpLogger from './src/middleware/httpLogger.js';
import chatSocket from "./src/sockets/chatSocket.js";
import authRoutes from "./src/routes/AuthRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import offerRoutes from "./src/routes/offerRoutes.js";
import wishlistRoutes from "./src/routes/wishlistRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";

const PORT = process.env.PORT || 8000;

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(httpLogger); // Log every HTTP request

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payments", paymentRoutes);


// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    user: req.user?.id || "unauthenticated",
  });
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

// ── Socket.io ─────────────────────────────────────────────────
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
chatSocket(io);

// ── Start ─────────────────────────────────────────────────────
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

// ── Catch unhandled errors ────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  logger.error({ message: "Unhandled Promise Rejection", reason: String(reason) });
});

process.on("uncaughtException", (err) => {
  logger.error({ message: "Uncaught Exception", error: err.message, stack: err.stack });
  process.exit(1);
});
