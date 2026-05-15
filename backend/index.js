import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
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
import reviewRoutes from "./src/routes/reviewRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:4000",
  credentials: true,
}));
app.use(express.json());
app.use(httpLogger);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Rate Limiters ───────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 requests per window
  message: { message: "Too many attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,            // max 100 requests per minute
  message: { message: "Too many requests, please slow down" },
  standardHeaders: true,
  legacyHeaders: false,
}); // Log every HTTP request

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", generalLimiter, productRoutes);
app.use("/api/admin", generalLimiter, adminRoutes);
app.use("/api/cart", generalLimiter, cartRoutes);
app.use("/api/orders", generalLimiter, orderRoutes);
app.use("/api/offers", generalLimiter, offerRoutes);
app.use("/api/wishlist", generalLimiter, wishlistRoutes);
app.use("/api/payments", generalLimiter, paymentRoutes);
app.use("/api/reviews", generalLimiter, reviewRoutes);


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
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL || "http://localhost:4000" } });
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
