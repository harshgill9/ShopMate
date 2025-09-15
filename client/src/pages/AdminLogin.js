// frontend/src/pages/AdminLogin.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    // ✅ Yahan humne `adminLogin` function ko `useAuth` se destructure kiya hai.
    const { adminLogin } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Loading state start
        setError('');

        try {
            // ✅ Ab `adminLogin` function ko call kiya ja sakta hai.
            const user = await adminLogin(username, password); 
            
            toast.success('Admin login successful!');
            if (user && user.role === 'admin') {
                navigate('/admin');
            } else {
                setError('Login failed. Not an admin.');
                toast.error('Login failed. Not an admin.');
            }

        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
            toast.error(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false); // Loading state stop
        }
    };

    return (
        <div className="flex items-center mb-[-30rem] justify-center min-h-screen bg-gray-200 dark:bg-gray-900 p-4 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-sm transition-colors duration-300">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Admin Login</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
