import dotenv from 'dotenv';
import express from "express";
import nodemailer from "nodemailer";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// ✅ Gmail Transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Place new order
router.post("/place", protect, async (req, res) => {
  try {
    const { products, totalAmount, paymentMethod, shippingAddress } = req.body;

    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
      paymentMethod,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        address: `${shippingAddress.house}, ${shippingAddress.road}, Nearby: ${shippingAddress.nearby || ""}`,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: "India",
        phone: shippingAddress.phone
      },
      status: "Pending",
    });

    const savedOrder = await order.save();

    // Send response immediately after order saved
    res.status(201).json({ success: true, order: savedOrder });

    // Send email asynchronously in background, no waiting here
    (async () => {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: shippingAddress.email,
          subject: "✅ Order Placed Successfully!",
          text: `Hello ${shippingAddress.fullName},\n\nYour order (${savedOrder._id}) has been placed successfully.\nTotal Amount: ₹${totalAmount}\n\nThank you for shopping with us!\n\n- Team Shop`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
      } catch (err) {
        console.error("❌ Email send error:", err.message);
      }
    })();

  } catch (error) {
    console.error("❌ Order Place Error:", error.message);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
});

// Get all orders of logged in user
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.product");
    res.json({ orders });  // ya directly res.json(orders);
  } catch (error) {
    console.error("❌ Fetch Orders Error:", error.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ Get order by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("❌ Fetch Order Error:", error.message);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// ✅ Clear all orders for the logged-in user
router.delete("/clear", protect, async (req, res) => {
  try {
    const result = await Order.deleteMany({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: "All orders cleared",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("❌ Failed to clear orders:", error.message);
    res.status(500).json({ success: false, message: "Failed to clear orders" });
  }
});

export default router;
