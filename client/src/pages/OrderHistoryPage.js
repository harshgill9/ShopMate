// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import OrderCard from '../components/orderCard'; // Corrected import statement

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// const OrderHistoryPage = () => {
//     const { token } = useAuth();
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             if (!token) {
//                 setLoading(false);
//                 setError("Please login to view your orders.");
//                 return;
//             }

//             try {
//                 const res = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 if (!res.ok) {
//                     const errorData = await res.json();
//                     throw new Error(errorData.message || 'Failed to fetch orders');
//                 }

//                 const data = await res.json();
//                 setOrders(data);
//             } catch (err) {
//                 setError(err.message);
//                 toast.error(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, [token]);

//     if (loading) {
//         return <div className="flex justify-center items-center min-h-screen">Loading your orders...</div>;
//     }

//     if (error) {
//         return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
//     }

//     if (orders.length === 0) {
//         return <div className="flex justify-center items-center min-h-screen">You have no orders yet.</div>;
//     }

//     return (
//         <div className="container mx-auto p-4 pt-28 max-w-4xl">
//             <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">My Orders</h1>
//             <div className="space-y-6">
//                 {orders.map((order) => (
//                     <OrderCard key={order._id} order={order} />
//                 ))}
//             </div>
//             <ToastContainer />
//         </div>
//     );
// };

// export default OrderHistoryPage;
