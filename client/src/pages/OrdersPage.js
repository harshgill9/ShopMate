import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "../components/orderCard";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersPage = () => {
  const { user, isLoggedIn, isAuthReady } = useAuth() || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // console.log("OrderCard: imageName", imageName, "product:", product);
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token && !isLoggedIn) {
          navigate("/login");
          return;
        }

        setLoading(true);
        setError(null);

        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

        const response = await axios.get(`${API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched orders:", response.data.orders || response.data);

        setOrders(response.data.orders || response.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch orders.");
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthReady === undefined || isAuthReady === true) {
      fetchOrders();
    }
  }, [isLoggedIn, isAuthReady, navigate]);

  const clearOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

      await axios.delete(`${API_URL}/api/orders/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Orders cleared successfully!");
      setOrders([]);
    } catch (error) {
      console.error("Error clearing orders:", error);
      toast.error("Failed to clear orders.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <p className="text-xl font-semibold text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Please log in to view your orders.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex justify-center items-start py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mt-16 px-4">
        <h1 className="text-3xl font-bold mb-6 pt-6 lg:pt-0 text-center text-gray-800 dark:text-white">My Orders</h1>
        <div className="mt-2 mb-6 text-center">
          <button
            onClick={clearOrders}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Clear My Orders
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-lg text-gray-600 dark:text-gray-300">
            You have not placed any orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="w-full border rounded-lg p-0 shadow-md bg-white dark:bg-gray-800"
              >
                {/* <div className="space-y-3"> */}
                  {order.products.map((item, idx) => {
                    console.log("OrderPage: product.image for item", idx, item.product?.image);
                    return(
                      <OrderCard
                        key={idx}
                        item={{
                          product: item.product,
                          size: item.size,
                          quantity: item.quantity,
                          seller: item.seller,
                          total: order.totalAmount || order.totalPrice,
                          itemsCount: order.products.length,
                          date: order.createdAt,
                          status: order.status,
                          orderId: order._id,
                        }}
                      />
                    );
                  })}
                {/* </div> */}
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrdersPage;
