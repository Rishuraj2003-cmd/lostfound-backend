// src/routes/visitorRoutes.js
import express from "express";
import Visitor from "../models/Visitor.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = await Visitor.create({ count: 1 });
    } else {
      visitor.count += 1;
      await visitor.save();
    }

    // return response
    res.json({ count: visitor.count });
  } catch (err) {
    console.error("❌ Error fetching visitor count:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
