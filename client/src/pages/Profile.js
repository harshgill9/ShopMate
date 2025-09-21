import React, { useEffect, useState } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { Link } from 'react-router-dom';


const Profile = () => {
    const { user, logout, deleteAccount } = useAuth();
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

               const res = await api.get("/api/auth/me"); // ✅ custom Axios instance
                setProfileData(res.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="container mx-auto p-4 mt-16 text-center min-h-screen bg-white dark:bg-gray-900 transition-colors">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">User Profile</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Please log in to view your profile.
                </p>
                <Link
                    to="/login"
                    className="mt-4 inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition"
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 mt-10 min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <div className="max-w-md mx-auto mt-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                    Welcome, {user.username}!
                </h2>

                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        <strong>Username:</strong> {user.username}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        <strong>Email:</strong> {user.email}
                    </p>
                </div>

                {/* Logout Button */}
                <div className="mt-6">
                    <button
                        onClick={logout}
                        className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                    >
                        Logout
                    </button>
                </div>

                {/* Delete Account Section */}
                <div className="mt-4">
                    <button
                        onClick={() => {
                            const confirmDelete = window.confirm(
                                "⚠️ Are you sure you want to delete your account? This action cannot be undone."
                            );
                            if (confirmDelete) {
                                deleteAccount();
                            }
                        }}
                        className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                    >
                        Delete My Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
