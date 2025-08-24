// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import passport from "passport";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import "./config/passport.js";

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://lostfound-frontend.vercel.app"
      ];
  
      if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };
  

// 🔐 Middlewares
app.use(helmet());
app.use(cors(corsOptions));   // ✅ Ye line add karo
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// 🚀 Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visitor", visitorRoutes);
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running 🚀" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

export default app;
