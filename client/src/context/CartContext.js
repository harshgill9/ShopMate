import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // Only user from AuthContext
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cartItems')) || [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Cart operations
  const addToCart = (product) => {
    const id = product._id || product.id;  
    const existing = cartItems.find(i => i.id === id);    
    const updated = existing
      ? cartItems.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cartItems, { ...product, id, quantity: 1 }];
    setCartItems(updated);
    toast.success(`${product.name} added to cart!`);
  };

  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(i => i._id === id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(i => i._id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(i => i._id !== id));
    toast.info('Product removed from cart.');
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared!');
  };

  const getTotalPrice = () => cartItems.reduce((total, i) => total + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart,
      getTotalPrice,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};
