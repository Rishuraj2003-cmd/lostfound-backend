
// src/app.js

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import passport from 'passport';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js'; 
import commentRoutes from './routes/commentRoutes.js';
import './config/passport.js';
import userRoutes from "./routes/userRoutes.js";
const app = express();
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());



// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes); 
app.use('/api/comments', commentRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/users", userRoutes);
// ... your errorHandler and other code

app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  });
  
  // Global error handler
  app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(500).json({ message: "Something went wrong on the server" });
  });

  
export default app;