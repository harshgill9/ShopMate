import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // <-- cart context se data aayega
import { useAuth } from "../context/AuthContext"; // <-- login user ka token lene ke liye

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart } = useCart();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/orders/place", // backend route
        { cartItems, totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        clearCart(); // cart khali kar dena
        navigate(`/order-success/${data.orderId}`); // success page pe bhejna
      }
    } catch (error) {
      console.error("Order Error:", error.response?.data || error.message);
      alert("Failed to place order. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default PlaceOrder;
