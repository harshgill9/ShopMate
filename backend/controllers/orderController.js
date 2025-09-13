import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import nodemailer from "nodemailer";

// ✅ Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // tumhara Gmail
    pass: process.env.EMAIL_PASS  // App Password (normal Gmail password nahi chalega)
  }
});

// ✅ Email bhejne ka function
const sendOrderConfirmationEmail = async (userEmail, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Order Confirmation - Your Order is Successful 🎉",
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalPrice}</p>
      <p>We will notify you once your order is shipped 🚚</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Place Order controller
const placeOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

let emailSent = false;

  try {
    await sendOrderConfirmationEmail(req.user.email, createdOrder);
    emailSent = true;
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }

  // ✅ Send both order and emailSent flag
  res.status(201).json({
    order: createdOrder,
    emailSent,
  });
});

// ✅ Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (order) {
     res.json({
      ...order.toObject(),
      emailSent: false, // ya true agar tu chahe, lekin safer false hi rakhna
    });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// ✅ Get my orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

export { placeOrder, getOrderById, getMyOrders };
