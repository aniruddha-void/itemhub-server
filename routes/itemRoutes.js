const express = require("express");
const multer = require("multer");
const path = require("path");
const Item = require("../models/Item");
const router = express.Router();

// Setup multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST: Add new item
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { name, type, description } = req.body;
      const coverImage = req.files["coverImage"]?.[0]?.path.replace(/\\/g, "/");
      const images = req.files["images"]
        ? req.files["images"].map((file) => file.path.replace(/\\/g, "/"))
        : [];

      const newItem = new Item({ name, type, description, coverImage, images });
      await newItem.save();
      res.status(201).json({ message: "Item successfully added" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error adding item" });
    }
  }
);

// GET: All items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching items" });
  }
});

module.exports = router;
