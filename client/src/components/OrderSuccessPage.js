import Loader from "./Loader";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const OrderSuccess = () => {
  const { id: orderId } = useParams();
  const { token, isAuthReady, isLoggedIn } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthReady) return;
    const fetchOrderDetails = async () => {
      if (!token || !orderId) {
        setLoading(false);
        setError("Order details not available. Please login.");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch order details");
        }

        const data = await res.json();
        setOrder(data);
        toast.success("🎊 Order Placed Successfully!");

        if (data.emailSent ?? true) {
          toast.success("📧 Confirmation email sent!");
        } else {
          toast.warn("⚠️ Order placed but email not sent.");
        }

        localStorage.removeItem("emailSent");
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, token, isAuthReady]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-400 bg-gray-900">Error: {error}</div>;
  }

  if (!order) {
    return <div className="flex justify-center items-center min-h-screen text-gray-300 bg-gray-900">No order found.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-md text-center border border-gray-700">
        <h1 className="text-2xl font-bold text-green-400">🎉 Order Placed Successfully!</h1>
        <p className="mt-2 text-gray-300">Order ID: <b>{order._id}</b></p>
        <p className="mt-1 text-gray-300">Total: ₹{order.totalAmount ? order.totalAmount.toFixed(2) : "N/A"}</p>
        <p className="mt-1 text-gray-300">Status: {order.status}</p>

        <div className="mt-6 flex flex-col space-y-4">
          <Link
            to="/orders"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default OrderSuccess;
