import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from "./src/routes/AuthRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import offerRoutes from "./src/routes/offerRoutes.js";
import wishlistRoutes from "./src/routes/wishlistRoutes.js";

const PORT=process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/wishlist", wishlistRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});


server.listen(PORT || 8000, () => {
  console.log("Server running on port", PORT);
});