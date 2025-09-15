// src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

// Yeh component check karta hai ki user logged in hai ya nahi
const PrivateRoute = ({ children }) => {
  // localStorage se token lein
  const token = localStorage.getItem('token');

  // Agar token maujood hai, to children (My Orders page) ko dikhayein
  // Agar nahi hai, to login page par redirect kar dein
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
