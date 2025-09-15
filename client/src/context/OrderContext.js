// frontend/src/context/OrderContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth(); 

  const buyNow = async (productDetails) => {
    try {
      if (!user || !user._id) { 
        toast.error('You must be logged in to place an order.');
        return;
      }
      
      const userId = user._id;
      
      const response = await axios.post(`http://localhost:5000/api/orders/${userId}`, {
        items: [{
          productId: productDetails.productId,
          quantity: productDetails.quantity,
        }],
      });
      
      const newOrder = response.data;
      setOrders([...orders, newOrder]);
      toast.success('Order placed successfully!');
      return newOrder;
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again later.');
      throw error;
    }
  };

  const fetchOrders = async () => {
    try {
      if (!user || !user._id) { // FIX: fetchOrders mein bhi user aur user._id ko check kiya gaya hai
        return;
      }
      
      const userId = user._id;
      const response = await axios.get(`http://localhost:5000/api/orders/${userId}`);
      
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to fetch orders.');
    }
  };

  const contextValue = {
    orders,
    buyNow,
    fetchOrders,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
