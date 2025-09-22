import dotenv from "dotenv"
import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

dotenv.config();

const router = express.Router();
// const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

// ---------------- Multer Config ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: Images Only! (jpeg, jpg, png, gif)"));
  },
});

const getFullImageUrl = (req, imageName) => {
  const host = req.get("host");
  const isLocalhost = host.includes("localhost") || host.startsWith("127.") || host.startsWith("192.");
  const protocol = isLocalhost ? "http" : "https";
  return `${protocol}://${host}/uploads/${imageName}`;
};

// ---------------- Routes ----------------
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
    const productsWithFullImageUrl = products.map((product) => {
      if (product.image && !product.image.startsWith("http")) {
        product.image = getFullImageUrl(req, product.image);
      }
      return product;
    });
    res.json(productsWithFullImageUrl);
  } catch (error) {
    console.error("Error during product search:", error.message);
    res
      .status(500)
      .json({ message: "Server Error: Search failed.", error: error.message });
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

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    const productsWithFullImageUrl = products.map((product) => {
      if (product.image && !product.image.startsWith("http")) {
        product.image = getFullImageUrl(req, product.image);
      }
      return product;
    });
    res.json(productsWithFullImageUrl);
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

    if (product.image && !product.image.startsWith("http")) {
      product.image = getFullImageUrl(req, product.image);
    }
    res.json(product);
  } catch (err) {
    console.error(`Error fetching product with ID ${req.params.id}:`, err.message);
    res.status(500).json({ error: "Server Error: Could not fetch product." });
  }
});

// Add new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, stock, rating, reviews } =
      req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      image: req.file ? req.file.filename : "",
      category,
      stock,
      rating,
      reviews,
    });

    const savedProduct = await newProduct.save();
    if (savedProduct.image && !savedProduct.image.startsWith("http")) {
      savedProduct.image = getFullImageUrl(req, savedProduct.image);
    }
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error saving single product:", err.message);
    res.status(500).json({ error: "Server Error: Could not save product." });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ error: "Product not found." });

    if (updatedProduct.image) {
      if (!updatedProduct.image.startsWith("http")) {
        updatedProduct.image = getFullImageUrl(req, updatedProduct.image);
      } else {
        const urlParts = updatedProduct.image.split('/');
        updatedProduct.image = urlParts[urlParts.length - 1];
      }
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error(`Error updating product:`, err.message);
    res.status(500).json({ error: "Server Error: Could not update product." });
  }
});


// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ error: "Product not found." });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(`Error deleting product:`, err.message);
    res.status(500).json({ error: "Server Error: Could not delete product." });
  }
});

export default router;