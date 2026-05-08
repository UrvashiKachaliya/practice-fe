import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import chatSocket from "./src/sockets/chatSocket.js";
import authRoutes from "./src/routes/AuthRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";

const PORT=process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

chatSocket(io);

server.listen(PORT || 8000, () => {
  console.log("Server running on port", PORT);
});