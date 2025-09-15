import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const CartPage = () => {
  const { cartItems, setCartItems, removeItem, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  const { isLoggedIn, isAuthReady, user } = useAuth();
  const navigate = useNavigate();

  // ✅ Axios default header set once
  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  }, [user]);

  // ✅ Server se cart load karo jab user login ho
  useEffect(() => {
    if (isAuthReady && isLoggedIn && user?.token) {
      axios.get('http://localhost:5000/api/cart')
        .then(res => {
          setCartItems(res.data.products || []);
        })
        .catch(err => {
          console.error('Cart fetch error:', err);
          toast.error('Failed to load cart.');
        });
    }
  }, [isAuthReady, isLoggedIn, user, setCartItems]);

  // ✅ Agar user login nahi hai to redirect
  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      toast.info('Please log in to view your cart!');
      navigate('/login');
    }
  }, [isLoggedIn, isAuthReady, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4 md:p-8 dark:bg-gray-900 dark:text-gray-100 min-h-screen transition-colors">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-400 dark:text-gray-500">
          <p className="text-xl">Your cart is empty!</p>
          <p className="mt-2">Add some amazing products to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center border-b border-gray-200 dark:border-gray-700 last:border-b-0 py-4">
                <img
                  src={
                    item.image?.startsWith('http')
                      ? item.image
                      : `http://localhost:5000/${item.image}`
                  }
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">₹{item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="mx-4">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="ml-4 text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="font-bold text-lg">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="mt-6 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Clear Cart
            </button>
          </div>

          <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-semibold">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
              <span className="font-semibold">Free</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t border-gray-300 dark:border-gray-600 pt-4">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              className="mt-6 w-full py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
