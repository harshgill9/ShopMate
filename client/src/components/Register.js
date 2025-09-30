import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './Loader';
import axios from 'axios';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // State to store form data
  const [formData, setFormData] = useState({
    name: '',
    username: '', 
    email: '',
    phoneNumber: '', 
    password: '',
    confirmPassword: '',
  });

  // State for managing validation errors and success message
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission and validation
  const handleRegister = async (e) => {
    e.preventDefault(); 
    
    setErrors({});
    setSuccess('');
    setLoading(true);

    // Client-side validation logic
    let formErrors = {};
    if (!formData.name.trim()) {
      formErrors.name = 'Name is required.';
    }
    if (!formData.username.trim()) {
      formErrors.username = 'Username is required.';
    }
    if (!formData.email.trim()) {
      formErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Email is invalid.';
    }
    if (!formData.phoneNumber.trim()) {
        formErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        formErrors.phoneNumber = 'Phone number must be 10 digits.';
    }
    if (!formData.password.trim()) {
      formErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match.';
    }

    // Check if there are any errors
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    } 
    try {
      const { confirmPassword, ...userData } = formData;
       console.log("Register payload:", userData);

      const registrationSuccess = await register(userData);
      console.log("Registration Success:", registrationSuccess);

      // Ab hum check kar rahe hain ki kya registration sach mein successful hua hai
      if (registrationSuccess) {
        toast.success('Registration successful 🎉');
        setSuccess('Registration successful 🎉');

    //     try {
    //     await axios.post("http://localhost:5000/api/auth/send-otp", {
    //         email: formData.email, // form se email bhejna hai
    //     });
    //     toast.info("OTP sent to your email 📩");
    // } catch (err) {
    //     console.error("Send OTP error:", err);
    //     toast.error("Failed to send OTP ❌");
    // }

        setFormData({ 
          name: '', 
          username: '', 
          email: '', 
          phoneNumber: '', 
          password: '', 
          confirmPassword: '' 
        });
        // Successful registration ke baad user ko login page par le jaein
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        // Agar registration successful nahi hua, toh error dikhaein
        toast.error('Registration failed. Please try again.');
        setErrors({ api: 'Registration failed. Please try again.' });
      }
    } catch (err) {
      console.error("❌ Registration error:",err);
      const msg = err.response?.data?.msg || err.response?.data?.message || 'Registration failed';
      setErrors({ api: msg });
       toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    // Main container with full screen height, centered content, and padding
    <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900 transition-colors duration-300 p-8">
    <div className="bg-gray-200 flex-grow flex flex-col items-center justify-center p-4 lg:mt-[-6rem] lg:mb-[-30rem] m-4 dark:bg-gray-900 transition-colors duration-300 min-h-screen ">
      <div className="max-w-md w-full mt-20 md:mt-4 pt-8 lg:pt-0  bg-white p-8 rounded-2xl shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">

          {/* Display success message */}
          {success && (
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900 mb-4 dark:text-green-100 dark:border-green-700 border border-green-200 dark:border">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 dark:text-green-100 dark:border-green-700">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-100">{success}</h3>
                </div>
              </div>
            </div>
          )}

        <h2 className="text-3xl mt-8 font-bold text-center text-gray-900 dark:text-gray-100 mb-6">Create an Account</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-100">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              placeholder='Enter your name'
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition duration-150 ease-in-out"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-100">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder='Choice your username'
              required
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition duration-150 ease-in-out"
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-100">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder='Enter your email id'
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition duration-150 ease-in-out"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone Number Input */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 dark:text-gray-100">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              placeholder='Enter your phone number'
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition duration-150 ease-in-out"
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-100">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder='Choice your password'
              required
              autoComplete="off"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition duration-150 ease-in-out"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-100">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder='Confirm your password'
              required
              autoComplete="off"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition duration-150 ease-in-out"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

           {/* API error */}
          {errors.api && (
            <p className="mt-2 text-center text-sm text-red-600">{errors.api}</p>
          )}

          {/* Register Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              {loading ? <Loader /> : 'Register'}
            </button>
          </div>
        </form>
        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login here
          </a>
        </p>
      </div>
    </div>
    </div>
  );
}
