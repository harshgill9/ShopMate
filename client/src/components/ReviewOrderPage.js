import Loader from './Loader';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function ReviewOrderPage() {
  const { userLoading } = useAuth();
  const { cartItems, getTotalPrice } = useCart();
  const { user, token, isAuthReady, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    house: '',
    road: '',
    city: '',
    state: '',
    pincode: '',
    nearby: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false)

  // ✅ Refs object (map ke andar hook nahi use kiya)
  const refs = useRef({});
  const fields = ['fullName', 'email', 'phone', 'house', 'road', 'pincode', 'city', 'state', 'nearby'];

  // ✅ Enter press karne par next input focus
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = refs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  useEffect(() => {
    if (!isAuthReady) return;

    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const fetchAddress = async () => {
      if (!token) {
        toast.error("Token missing, please login again");
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!res.ok) {
          if (res.status === 404) {
            setIsEditing(true);
          } else {
            throw new Error("Failed to fetch address");
          }
        } else {
          const data = await res.json();
          if (data.shippingAddress && Object.keys(data.shippingAddress).length > 0) {
            setShippingAddress(data.shippingAddress);
            setIsEditing(false);
          } else {
            setShippingAddress({
              fullName: data.name || '',
              email: data.email || '',
              phone: data.phoneNumber || '',
              house: '',
              road: '',
              city: '',
              state: '',
              pincode: '',
              nearby: ''
            });
            setIsEditing(true);
          }
        }
      } catch (error) {
        toast.error("Error fetching address");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [isAuthReady, isLoggedIn, user, token, navigate, location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const formValid = useMemo(() => {
    if (!shippingAddress) return false;
    const required = ['fullName', 'email', 'phone', 'house', 'road', 'city', 'state', 'pincode'];
    return required.every(k => String(shippingAddress[k] || '').trim().length > 0);
  }, [shippingAddress]);

  const saveAddress = async () => {
    if (!token) {
      toast.error("Token missing, please login");
      navigate('/login');
      return;
    }

    if (!formValid) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);
      const userId = user?.id || user?._id || user?.userId; 
      if (!userId) {
        toast.error("User info missing, please login");
        navigate('/login');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          shippingAddress
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save address');
      }

      toast.success("Address saved!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Error saving address");
    } finally {
      setSaving(false);
    }
  };

  const buyNowProduct = useMemo(() => {
    return location.state?.product ? [location.state.product] : null;
  }, [location.state]);

  const itemsToDisplay = useMemo(() => buyNowProduct || cartItems, [buyNowProduct, cartItems]);

  const mrp = itemsToDisplay.reduce((acc, item) => acc + (Number(item.mrp || item.price) * (item.quantity || 1)), 0);

  const totalPrice = useMemo(() => {
    if (buyNowProduct) {
      return itemsToDisplay.reduce((acc, item) => acc + Number(item.price) * (item.quantity || 1), 0);
    }
    return getTotalPrice();
  }, [buyNowProduct, itemsToDisplay, getTotalPrice]);

  const discount = mrp - totalPrice;

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container max-w-5xl mx-auto pt-32 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LEFT SECTION */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold mb-4">🛒 Review Order</h1>

        {/* Product Details */}
        <div className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Product Details</h2>
          <div className="divide-y divide-gray-300 dark:divide-gray-700">
            {itemsToDisplay.map((item, idx) => (
              <div key={idx} className="flex gap-4 py-3">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">₹{item.price} x {item.quantity || 1}</p>
                  {item.mrp && (
                    <p className="text-sm line-through text-gray-500 dark:text-gray-500">₹{item.mrp}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
          
        {/* Delivery Address */}
        <div className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">Delivery Address</h2>
          {isEditing ? (
            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <input
                  key={field}
                  ref={(el) => (refs.current[index] = el)}
                  type={field === 'phone' || field === 'pincode' ? 'number' : field === 'email' ? 'email' : 'text'}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={shippingAddress[field]}
                  onChange={handleChange}
                  required={field !== 'nearby'}
                  className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
              <button
                onClick={saveAddress}
                disabled={saving}
                className={`mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          ) : (
            <div className="text-gray-800 dark:text-gray-300">
              <p><strong>Name:</strong> {shippingAddress.fullName}</p>
              <p><strong>Phone:</strong> {shippingAddress.phone}</p>
              <p>
                <strong>Address:</strong> {shippingAddress.house}, {shippingAddress.road},{' '}
                {shippingAddress.nearby ? `Near: ${shippingAddress.nearby}, ` : ''}
                {shippingAddress.city} - {shippingAddress.pincode}, {shippingAddress.state}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Section   */}
      <div className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Price Summary</h2>
        <div className="space-y-2 text-gray-800 dark:text-gray-300">
          <div className="flex justify-between">
            <span>Total MRP</span>
            <span>₹{mrp.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-700 dark:text-green-400">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
            <span>Total Amount</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <button
          onClick={() => {
            if (!formValid) {
              toast.error('Please save your delivery address.');
              return;
            }
            if (!itemsToDisplay || itemsToDisplay.length === 0) {
              toast.error("No items to order");
              return;
            }
            setIsNavigating(true)
            setTimeout(() => {
            navigate('/payment', {
              state: { items: itemsToDisplay, shippingAddress }
            });
          },600);
          }}
          disabled={isNavigating}
          className={`mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg shadow-md ${
            isNavigating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
          {isNavigating ? 'Processing...' : 'Continue to Payment'}
        </button>
      </div>
        <ToastContainer theme="dark" />
      </div>
    </div>
  );
}

export default ReviewOrderPage;
