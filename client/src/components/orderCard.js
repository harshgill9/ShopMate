import React, { useState } from "react";
import { Link } from "react-router-dom";

const OrderCard = ({ item }) => {
  const [showMore, setShowMore] = useState(false);
  const product = item.product || {};
  const imageName = product.image || "";

  // ✅ Check if image is full URL
  const isFullUrl = imageName.startsWith("http");
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const imageUrl =
    imageName && imageName.trim() !== ""
      ? isFullUrl
        ? imageName
        : `${BASE_URL}/uploads/${imageName}`
      : "https://dummyimage.com/112x112/cccccc/000000&text=No+Image";

  const productId = product._id;
  const orderId = item.orderId?.slice(0, 8) || "N/A";
  const orderDate = item.date
    ? new Date(item.date).toLocaleDateString()
    : "N/A";

  return (
    <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 shadow-md space-y-3 w-full">
      {/* ✅ Order ID */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          🧾 Order ID:
        </span>{" "}
        #{orderId}...
      </div>

      {/* Product Row */}
      <div className="flex gap-4 flex-col sm:flex-row items-center sm:items-start">
        {/* 📸 Image */}
        <Link to={`/product/${productId}`}>
          <img
            src={imageUrl}
            alt={product.name || "Product Image"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://dummyimage.com/112x112/cccccc/000000&text=No+Image";
            }}
            className="w-28 h-28 object-cover rounded-md border border-gray-300 dark:border-gray-700"
          />
        </Link>

        {/* 📄 Info */}
        <div className="flex flex-col justify-between w-full">
          <div>
            <Link to={`/product/${productId}`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:underline">
                {product.name || "Unnamed Product"}
              </h3>
            </Link>

            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              ₹{product.price || "N/A"}
            </p>

            {showMore && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  Size: {item.size || "Free Size"} • Qty: {item.quantity || 1}
                </p>
                <p>Sold by: {item.seller || "Unknown Seller"}</p>
                <p>Total: ₹{item.total || product.price || 0}</p>
                <p>Items: {item.itemsCount || 1}</p>
                <p>Date: {orderDate}</p>
                <p>Status: {item.status || "Pending"}</p>
              </div>
            )}
          </div>

          {/* More/Less Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-xs text-purple-600 dark:text-purple-400 mt-2 hover:underline w-fit"
          >
            {showMore ? "Show Less" : "More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
