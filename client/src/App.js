import {LoaderProvider, useLoader } from './context/LoaderContext';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import SearchResults from './pages/SearchResults';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import AddProduct from './components/AddProduct';
import ProductListAdmin from './components/ProductListAdmin';
import AdminLogin from './pages/AdminLogin';
import Login from './components/Login';
import Register from './components/Register';
import ReviewOrderPage from './components/ReviewOrderPage';
import Loader from './components/Loader';
import ProductDetail from './pages/ProductDetail';
import OrdersPage from './pages/OrdersPage';
// import OrderHistoryPage from './pages/OrderHistoryPage';
import PaymentPage from './components/PaymentPage';
import OrderSuccessPage from './components/OrderSuccessPage';
import PrivateRoute from './components/PrivateRoute';
// import LiveChatToggle from './components/LiveChatToggle';
import ChatBot from './components/ChatBot';



// Import CSS
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { loading } = useLoader();
  return (
    <div className="overflow-x-hidden">
    <LoaderProvider>/
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <div className="mt-16 flex flex-col min-h-screen bg-white text-gray-800">
                {loading && <Loader />} 
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/category/:categoryName" element={<SearchResults />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/product/:id" element={<ProductDetail />} />


                    {/* Protected User Routes */}
                    <Route
                      path="/cart"
                      element={
                        <PrivateRoute>
                          <Cart />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/review-order"
                      element={
                        <PrivateRoute>
                          <ReviewOrderPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <PrivateRoute>
                          <OrdersPage />
                        </PrivateRoute>
                      }
                    />

                    {/* Protected Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <PrivateRoute allowedRoles={['admin']}>
                          <ProductListAdmin />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/add-product"
                      element={
                        <PrivateRoute allowedRoles={['admin']}>
                          <AddProduct />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/payment"
                      element={
                        <PrivateRoute>
                          <PaymentPage />
                        </PrivateRoute>
                      }
                    />
                  <Route
                     path="/order-success/:id"
                     element={
                       <PrivateRoute>
                         <OrderSuccessPage />
                       </PrivateRoute>
                     }
                  />

                   
                    {/* Fallback for unmatched routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  {/* <LiveChatToggle /> */}
                  <ChatBot />
                </main>
                <ToastContainer position="bottom-right" autoClose={3000} />
              </div>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </LoaderProvider>
    </div>
  );
}

export default App;
