// frontend/src/pages/ProductDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StickyCategoryNavbar from '../components/StickyCategoryNavbar';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isLoggedIn, isAuthReady } = useAuth();

  const baseURL = process.env.REACT_APP_API_BASE_URL;

useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseURL}/api/products/${id}`);

      const productData = {
        ...data,
        image: data.image
          ? data.image.startsWith("http")
            ? data.image
            : `${baseURL}/uploads/${data.image}`
          : '/fallback-image.png',
        rating: data.rating || 4.2,
        ratingCount: data.ratingCount || 1200,
        reviewCount: data.reviewCount || 450,
        price: Number(data.price),
        id: data._id || data.id,
        name: data.name,
      };

      console.log('Product Image URL:', productData.image); // <== Yahan dekh

      setProduct(productData);
    } catch (err) {
      setError('Product load nahi ho paya. URL ya server mein dikkat ho sakti hai.');
      console.error('Fetch Product Error:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchProduct();
}, [id]);


  const handleAddToCart = () => {
    if (isAuthReady && !isLoggedIn) {
      toast.info('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!isAuthReady || !isLoggedIn) {
      toast.info('Please login to proceed with your purchase.');
      navigate('/login');
      return;
    }
    navigate('/review-order', { state: { product: { ...product, quantity }, quantity } });
  };

  if (loading || !isAuthReady) {
    return (
      <div className="flex justify-center items-center h-screen mt-16 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen mt-16 dark:bg-gray-900">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen mt-16 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">No Results found.</p>
      </div>
    );
  }

  return (
    <>
      <StickyCategoryNavbar />
      <div className="container mx-auto p-4 md:p-10 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-slate-100 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-6 mt-20 md:p-10 flex flex-col md:flex-row gap-8 md:max-w-4xl mx-auto">
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-95 object-contain rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="flex-1 flex flex-col justify-start">
            <h1 className="text-2xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
            <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 my-2">
              ₹ {product.price}
            </p>
            <div className="flex items-center mb-4">
              <label className="mr-2 text-sm text-gray-600 dark:text-gray-300">Qty:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-2 px-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all transform hover:scale-105 text-lg"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-2 px-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-all transform hover:scale-105 text-lg"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default ProductDetail;
