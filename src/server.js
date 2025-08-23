// server.js
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import Visitor from "./models/Visitor.js";
import authRoutes from "./routes/authRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";

const server = http.createServer(app);

// Attach socket.io
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach io to every req (for controllers if needed)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Auth routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running 🚀" });
});

// Visitor count API
app.get("/api/visitor", async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = await Visitor.create({ count: 1 });
    } else {
      visitor.count += 1;
      await visitor.save();
    }

    // Broadcast new count to all sockets
    io.emit("visitorCount", visitor.count);

    res.json({ count: visitor.count });
  } catch (err) {
    console.error("❌ Error fetching visitor count:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.use("/api/visitor", visitorRoutes);


// Socket.io events
io.on("connection", async (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // Send current visitor count to new client
  try {
    const visitor = await Visitor.findOne();
    if (visitor) {
      socket.emit("visitorCount", visitor.count);
    }
  } catch (err) {
    console.error("❌ Error sending visitor count:", err);
  }

  socket.on("joinReport", (reportId) => {
    socket.join(`report:${reportId}`);
    console.log(`📌 User joined report:${reportId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Start server
const port = process.env.PORT || 5001;

try {
  await connectDB();

  server.listen(port, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`);
  });
} catch (err) {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
}
