import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import StickyCategoryNavbar from '../components/StickyCategoryNavbar';

const Cart = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
        <StickyCategoryNavbar />
        <div className="mt-28 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Your Cart is Empty</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Seems like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <StickyCategoryNavbar />
      <div className="container mx-auto mt-20">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">Your Shopping Cart</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center justify-between py-6"
              >
                <div className="flex items-center">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg mr-6"
                    />
                  </Link>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">₹{Number(item.price).toFixed(2)}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm"
                      >
                        EDIT
                      </Link>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-300 font-semibold text-sm"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-4 md:mt-0">
                  <div className="flex items-center border dark:border-gray-600 rounded-full overflow-hidden">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-gray-800 dark:text-white font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t-2 border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              Total: <span className="text-blue-600 dark:text-blue-400">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
              <button
                onClick={clearCart}
                className="bg-gray-400 dark:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-500 dark:hover:bg-gray-500 transition-colors"
              >
                Clear Cart
              </button>
              <Link
                to="/checkout"
                className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-colors text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
