import express from "express";
import Visitor from "../models/Visitor.js";

const router = express.Router();

// GET visitor count
router.get("/", async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ count: 0 });
      await visitor.save();
    }
    res.json({ count: visitor.count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching visitor count" });
  }
});

export default router;
