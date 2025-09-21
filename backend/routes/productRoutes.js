import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Product from "../models/Product.js";

dotenv.config();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Cloudinary Storage Configuration for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shopmate-products",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    public_id: (req, file) => `product-${Date.now()}`,
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

// ---------------- Routes ----------------

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    // Cloudinary से आने वाले URLs पहले से ही पूर्ण होते हैं, इसलिए कोई बदलाव की जरूरत नहीं।
    res.json(products);
  } catch (err) {
    console.error("Error fetching all products:", err.message);
    res.status(500).json({ error: "Server Error: Could not fetch products" });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    // Cloudinary से आने वाले URLs पहले से ही पूर्ण होते हैं।
    res.json(product);
  } catch (err) {
    console.error(`Error fetching product with ID ${req.params.id}:`, err.message);
    res.status(500).json({ error: "Server Error: Could not fetch product." });
  }
});

// Search products
router.get("/search", async (req, res) => {
  const { q, category } = req.query;
  let filter = {};

  if (q) {
    const formattedQuery = q.replace(/-/g, " ");
    filter.$or = [
      { name: { $regex: formattedQuery, $options: "i" } },
      { category: { $regex: new RegExp(`^${formattedQuery}$`, "i") } },
    ];
  }

  if (category) {
    const formattedCategory = category.replace(/-/g, " ");
    filter.category = { $regex: new RegExp(`^${formattedCategory}$`, "i") };
  }

  try {
    const products = await Product.find(filter);
    if (products.length === 0 && (q || category)) {
      return res.status(404).json({ message: "No matching products found." });
    }
    // Cloudinary से आने वाले URLs पहले से ही पूर्ण होते हैं।
    res.json(products);
  } catch (error) {
    console.error("Error during product search:", error.message);
    res
      .status(500)
      .json({ message: "Server Error: Search failed.", error: error.message });
  }
});

// ✅ Add new product (Updated for Cloudinary)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, stock, rating, reviews } = req.body;
    const imageUrl = req.file ? req.file.path : ""; // Cloudinary से सीधा URL मिलेगा

    const newProduct = new Product({
      name,
      description,
      price,
      image: imageUrl, // सीधा URL डेटाबेस में सेव करें
      category,
      stock,
      rating,
      reviews,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error saving single product:", err.message);
    res.status(500).json({ error: "Server Error: Could not save product." });
  }
});

// ✅ Update product (Updated for Cloudinary)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, stock, rating, reviews } = req.body;
    const updateData = { name, description, price, category, stock, rating, reviews };
    
    if (req.file) {
      updateData.image = req.file.path; // Cloudinary से नया URL लें
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Product not found." });

    res.json(updatedProduct);
  } catch (err) {
    console.error(`Error updating product:`, err.message);
    res.status(500).json({ error: "Server Error: Could not update product." });
  }
});

// Bulk upload
router.post("/bulk", async (req, res) => {
  try {
    const productsArray = req.body;
    const result = await Product.insertMany(productsArray);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error during bulk product upload:", err.message);
    res.status(500).json({ error: "Server Error: Could not perform bulk upload." });
  }
});


// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found." });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(`Error deleting product:`, err.message);
    res.status(500).json({ error: "Server Error: Could not delete product." });
  }
});

export default router;