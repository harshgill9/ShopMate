import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

// =================== Load env ===================
dotenv.config();

// =================== App Init ===================
const app = express();

// ES Module ke liye __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =================== Models ===================
import "./models/User.js";
import "./models/Product.js";
import "./models/Cart.js";
import "./models/Order.js";

// =================== Routes ===================
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiChatRoute from "./routes/aiChatRoute.js";

// =================== Middleware ===================
app.use(express.json());

// ✅ CORS Setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Disable caching
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// ✅ Static folder for uploads
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// =================== MongoDB Connection ===================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// =================== API Routes ===================
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", aiChatRoute); 

// =================== Error Handler ===================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});

// =================== Server + Socket.IO ===================
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Socket.IO Chat
io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  socket.on("send_message", (data) => {
    console.log("✉️ Message received:", data);
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// =================== Health Check ===================
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// =================== Serve React in Production ===================
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/build"); // CRA build
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
