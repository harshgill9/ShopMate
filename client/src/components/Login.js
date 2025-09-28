import axios from 'axios';
import { useLoader } from '../context/LoaderContext';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [formData, setFormData] = useState({
    username: '',
    otp: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [password, setPassword] = React.useState('');

  // API base URL
  const BASE_URL = process.env.REACT_APP_API_URL 
                 ? `${process.env.REACT_APP_API_URL}/api/auth`
                 : "http://localhost:5000/api/auth";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP to user's registered email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Sending login data:", { username: formData.username, password: password });
      
      const res = await axios.post(`${BASE_URL}/login`, {
        username: formData.username,
        password: password,
      });

      if (res.data.success) {
            setRegisteredEmail(res.data.email); // save email from backend if returned
            setOtpSent(true);
            toast.success("OTP sent to your registered email 📩");
          }
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to send OTP ❌");
        } finally {
          setLoading(false);
        }
      };

  // Verify OTP and login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/verify-otp`, {
        email: registeredEmail,
        otp: formData.otp,
      });

       console.log("🟢 Verify OTP Response:", res.data);
      if (res.data?.token && res.data?.user) {
        login(res.data.token, res.data.user);
        toast.success("Logged in successfully 🎉");
        navigate("/");
      } else {
        toast.error("OTP verification failed ❌");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      toast.error(err.response?.data?.message || "Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900 transition-colors duration-300 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Login
        </h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder='Enter your username'
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={otpSent} // disable after sending OTP
            />
          </div>

          {!otpSent && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              />
            </div>
          )}

          {otpSent && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP from email"
                value={formData.otp}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}

          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              type='button'
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm 
                         text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                         transition duration-150 ease-in-out"
            >
              Send OTP
            </button>
          ) : (
            <button
              onClick={handleVerifyOtp}
              type='button'
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm 
                         text-sm font-medium text-white bg-green-600 hover:bg-green-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                         transition duration-150 ease-in-out"
            >
              Verify & Login
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
